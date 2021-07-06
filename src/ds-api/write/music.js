import spotifyApi from '../common/tracks/spotify-api-proxy';
import { play } from '../common/tracks/audioTrack';

export default class MusicController {
    #api;

    #defaultTrack = {
      albumCover: './images/empty.png',
      artistName: 'Artist',
      trackName: 'Song',
      spotifyLink: '#',
      isPlayable: false
    };

    async set () {
      this.#api = await spotifyApi();
    }

    release () {
      if (!this.#api) return;

      this.#api = null;
    }

    playTrack (track, loop = true) {
      play(track, loop);
    }

    async getTrack (trackId) {
      if (!trackId) return this.#defaultTrack;

      try {
        return await this.#api.getTrack(trackId);
      } catch (err) {
        console.error(err);

        return this.#defaultTrack;
      }
    }

    async searchTrack (trackName) {
      try {
        return await this.#api.searchTrack(trackName);
      } catch (err) {
        console.error(err);
      }
    }
}
