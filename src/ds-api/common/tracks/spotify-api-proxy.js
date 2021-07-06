import { get, post } from '../wrappedFetch';
import { SPOTIFY_PROXY_URL } from '../services';

/** From: https://www.npmjs.com/package/navigator-languages */
function getBrowserLanguages () {
  if (typeof navigator === 'object') {
    let t = 'anguage'; const n = navigator;

    const f = n['l' + t + 's'];

    return f && f.length ? f : ((t = n['l' + t]) || n['browserL' + t] || n['userL' + t]) ? [t] : t;
  }

  return ['en-GB']; // arbitrarily set to en-GB
}

function getUserMarket () {
  return getBrowserLanguages()[0].split('-')[1];
}

// ----------------------------------------------------------------------------

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';
const TRACK_ENDPOINT = 'tracks/';
const SEARCH_ENDPOINT = 'search/';

async function getSpotifyAuthToken () {
  return (await post(SPOTIFY_PROXY_URL + 'getSpotifyToken')).token;
}

function formatTrack (track, trackId) {
  if (!track) return null;

  const isPlayable = track.is_playable || (typeof track.preview_url === 'string' && track.preview_url.length > 4);

  const previewAudio = isPlayable
    ? {
        previewURL: track.preview_url,
        markets: track.available_markets
      }
    : {};

  return {
    trackId: trackId,
    albumCover: track.album.images[1].url,
    artistName: track.artists[0].name,
    trackName: track.name,
    spotifyLink: track.external_urls.spotify,
    isPlayable: isPlayable && previewAudio.previewURL !== null,
    ...previewAudio
  };
}

async function spotifyApi () {
  const detectedMarket = getUserMarket();

  const reqInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: ''
    },

    cache: 'no-cache'
  };

  async function setAuthorizationHeader () {
    const authToken = await getSpotifyAuthToken();

    reqInit.headers.Authorization = 'Bearer ' + authToken;
  }

  await setAuthorizationHeader();

  function isUnauthorized (error) {
    return typeof error === 'number' && error === 401;
  }

  async function apiGet (endpoint, params) {
    const url = endpoint + params;

    let response;

    try {
      response = await get(url, reqInit);
    } catch (error) {
      if (isUnauthorized(error)) {
        await setAuthorizationHeader();

        response = await get(url, reqInit);
      } else {
        throw error;
      }
    }

    return response;
  }

  async function getTrack (trackId, market = detectedMarket) {
    const endpoint = SPOTIFY_API_URL + TRACK_ENDPOINT + trackId;
    const params = '?market=' + market;

    const track = await apiGet(endpoint, params);

    return formatTrack(track, trackId);
  }

  async function getTracks (trackIds) {
    const endpoint = SPOTIFY_API_URL + TRACK_ENDPOINT;
    const params = `?ids=${trackIds.join(',')}`;

    const tracks = (await apiGet(endpoint, params))?.tracks;

    return tracks.map(track => formatTrack(track, track.id));
  }

  async function searchTrack (query, market = detectedMarket, limit = 12) {
    const formattedQuery = query.split(' ').join('+');

    const endpoint = SPOTIFY_API_URL + SEARCH_ENDPOINT;
    const params = `?q=${formattedQuery}&type=track&limit=${limit}&market=${market}`;

    const tracks = (await apiGet(endpoint, params))?.tracks;

    return tracks.items.map(track => formatTrack(track, track.id));
  }

  return {
    getTrack,
    getTracks,
    searchTrack
  };
}

export default spotifyApi;

export async function getTrack (trackId) {
  const api = await spotifyApi();

  return api.getTrack(trackId);
}

export async function getTracks (trackIds) {
  const api = await spotifyApi();

  return api.getTracks(trackIds);
}
