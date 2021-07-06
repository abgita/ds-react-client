import { STICKERS_URL, TELEGRAM_PROXY_URL } from '../services';

import { get } from '../wrappedFetch';
import { formatSticker } from './sticker';

export default class StickersList {
    #stickersList
    #fetchPromise

    #tryGetFromLS () {
      try {
        const storage = window.localStorage;

        const stickers = JSON.parse(storage.getItem('stickers'));

        if (stickers && Date.now() < stickers.expirationTime) {
          this.#stickersList = stickers.list;

          return true;
        }
      } catch (ignored) {
      }

      return false;
    }

    #trySaveOnLS () {
      const stickersList = this.#stickersList;

      const stickers = {
        expirationTime: Date.now() + (60 * 60 * 24 * 1000 /* a day in ms */),
        list: stickersList
      };

      try {
        window.localStorage.setItem('stickers', JSON.stringify(stickers));
      } catch (ignored) {
      }
    }

    async #fetchFromServer () {
      const list = await get(STICKERS_URL + 'getStickers');

      const telegramProxyURL = TELEGRAM_PROXY_URL;

      this.#stickersList = list.map((sticker, index) => {
        const item = formatSticker(sticker, index);

        item.thumbFile.imgSrc = `${telegramProxyURL}sticker/thumb/${item.thumbFile.id}`;

        return item;
      });

      this.#trySaveOnLS();
    }

    // fetches the full list of available stickers from the server or LocalStorage (if any)
    // @returns the stickers list
    async fetch () {
      if (this.#fetchPromise) {
        return this.#fetchPromise.then(() => {
          return this.#stickersList;
        });
      }

      if (!this.#stickersList && !this.#tryGetFromLS()) {
        try {
          this.#fetchPromise = this.#fetchFromServer();

          await this.#fetchPromise;

          this.#fetchPromise = null;
        } catch (error) {
          throw new Error('Cannot get stickers!');
        }
      }

      return this.#stickersList;
    }

    // returns the -already- fetched stickers list
    // @see #fetch()
    get () {
      return this.#stickersList;
    }

    // releases the -already- fetched stickers list
    // @see #fetch()
    release () {
      this.#stickersList = null;
    }
}
