import AnimationLoaderWorker from './animation-loader.worker.js';

import { WorkerChannel, WorkerListener } from './worker-utils.js';

export default class StickerLoader {
    #apiURL;

    #animationLoader;

    #workersChannel;
    #messageListener;

    constructor (telegramProxyURL) {
      this.#apiURL = telegramProxyURL;

      this.#setWorker();
    }

    release () {
      this.#workersChannel.close();
      this.#animationLoader.terminate();

      this.#apiURL = null;
      this.#messageListener = null;
      this.#workersChannel = null;
      this.#animationLoader = null;
    }

    #setWorker () {
      this.#animationLoader = new AnimationLoaderWorker();
      this.#workersChannel = new WorkerChannel();

      this.#messageListener = (event) => {
        if (!event.data || !event.data.id) {
          console.log('Wrong formatted event.data');

          return;
        }

        const { id, content } = event.data;

        this.#workersChannel.emit(id, content);
      };

      this.#animationLoader.addEventListener('message', this.#messageListener);
    }

    loadAnimation (sticker) {
      if (!sticker) return Promise.reject(new Error('Invalid sticker!'));

      const id = sticker.uniqueId;
      const fileId = sticker.id;

      return new Promise((resolve, reject) => {
        const listener = new WorkerListener({
          runOnce: true,

          callback: (res) => {
            if (res.error) {
              reject(res.error);
            } else {
              sticker.animation.jsonLoaded = true;
              sticker.animation.json = res;

              resolve(sticker);
            }
          }
        });

        this.#workersChannel.listen(id, listener);

        this.#animationLoader.postMessage({ id: id, fileId: fileId, url: this.#apiURL });
      });
    }
}
