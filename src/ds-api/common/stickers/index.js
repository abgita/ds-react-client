import { STICKERS_URL, TELEGRAM_PROXY_URL } from '../services';
import { get } from '../wrappedFetch';
import { formatSticker } from './sticker';

import StickersList from './stickersList';
import StickerLoader from './loader';

export function newStickerLoader () {
  return new StickerLoader(TELEGRAM_PROXY_URL);
}

export async function fetchSticker (stickerId) {
  const res = await get(STICKERS_URL + `getSticker/${stickerId}`);

  const sticker = formatSticker(res, 0);

  sticker.thumbFile.imgSrc = `${TELEGRAM_PROXY_URL}sticker/thumb/${sticker.thumbFile.id}`;

  return sticker;
}

export function getStickersByEmojiSet (stickersList, emojiSet, mask) {
  const found = mask === 1;

  return stickersList.filter(sticker => {
    const stickerEmojis = sticker.emojis;

    for (let i = mask === 1 ? 0 : 1, l1 = emojiSet.length; i < l1; i++) {
      const emoji = emojiSet[i];

      for (let j = 0, l2 = stickerEmojis.length; j < l2; j++) {
        if (stickerEmojis[j].includes(emoji)) return found;
      }
    }

    return !found;
  }).reverse();
}

export function findById (stickersList, uniqueId) {
  const filter = stickersList.filter(s => s.uniqueId === uniqueId);

  return filter ? filter[0] : null;
}

const stickers = new StickersList();

export async function getStickers () {
  return await stickers.fetch();
}

export default stickers;
