import { get } from '../wrappedFetch';
import { POSTS_URL } from '../services';
import { getTracks } from '../tracks/spotify-api-proxy';
import { findById, getStickers } from '../stickers';

export async function getLatest () {
  const res = await get(POSTS_URL + 'posts/latest');

  const latest = res.map((pair, i) => {
    const pairId = pair.pairId;
    const ids = pairId.split(':');

    const stickerId = ids[0];
    const trackId = ids[1];

    return {
      id: pairId,
      index: i,
      stickerId: stickerId,
      trackId: trackId
    };
  });

  const stickersList = await getStickers();
  const tracks = await getTracks(latest.map(pair => pair.trackId));

  return latest.map(item => {
    const post = { ...item };

    const sticker = findById(stickersList, item.stickerId);

    if (sticker) post.sticker = sticker;

    const track = tracks.filter(t => t.trackId === item.trackId)?.[0];

    if (track) post.track = track;

    return post;
  });
}

export async function getTop () {
  const res = await get(POSTS_URL + 'posts/top');

  const top = res.slice(0, 10).map((item, i) => {
    const pairId = item.id;
    const ids = pairId.split(':');

    const stickerId = ids[0];
    const trackId = ids[1];

    return {
      id: pairId,
      index: i,
      stickerId: stickerId,
      trackId: trackId,
      usage: item.usage
    };
  });

  const stickersList = await getStickers();
  const tracks = await getTracks(top.map(pair => pair.trackId));

  return top.map(item => {
    const post = { ...item };

    const sticker = findById(stickersList, item.stickerId);

    if (sticker) post.sticker = sticker;

    const track = tracks.filter(t => t.trackId === item.trackId)?.[0];

    if (track) post.track = track;

    return post;
  });
}
