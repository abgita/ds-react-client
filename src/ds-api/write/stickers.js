import StickersList, { newStickerLoader } from '../common/stickers';

export default class StickersController {
    #stickersLoader;

    constructor () {
      this.#stickersLoader = newStickerLoader();
    }

    async set () {
      if (StickersList.get()) return;

      try {
        const list = await StickersList.fetch();

        // load a sticker to ensure the server is ready
        // after exiting this function
        await this.loadAnimation(list[0]);
      } catch (error) {
        console.error(error);
      }
    }

    release () {
      StickersList.release();

      this.#stickersLoader.release();
      this.#stickersLoader = null;
    }

    getList () {
      return StickersList.get();
    }

    loadAnimation (sticker) {
      return this.#stickersLoader?.loadAnimation(sticker);
    }
}
