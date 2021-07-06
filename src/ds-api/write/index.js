import StickersController from './stickers.js';
import MusicController from './music.js';

import { post } from '../common/wrappedFetch';
import { POSTS_URL } from '../common/services';
import { ON_DEVELOPMENT } from '../../config';
import { releaseAnimation } from '../common/stickers/lottie';

export class DancingStickers {
  #stickersController;
  #musicController;

  #selectedSticker;
  #stickerSelectedListeners = [];

  #selectedTrack;
  #trackChangeListeners = [];

  async init () {
    this.#stickersController = new StickersController();
    this.#musicController = new MusicController();

    try {
      const setStickersController = this.#stickersController.set();
      const setMusicController = this.#musicController.set();

      await Promise.all([setStickersController, setMusicController]);
    } catch (err) {
      console.error(err);
    }
  }

  release () {
    if (this.#stickersController) this.#stickersController.release();
    if (this.#musicController) this.#musicController.release();

    this.#stickersController = null;
    this.#musicController = null;

    this.#selectedSticker = null;
    this.#stickerSelectedListeners = [];

    if (this.#selectedTrack) this.#stopCurrentTrack();

    this.#selectedTrack = null;
    this.#trackChangeListeners = [];
  }

  addStickerChangeListener (callback) {
    if (!this.#stickerSelectedListeners) return;

    this.#stickerSelectedListeners.push(callback);

    if (this.#selectedSticker) callback(this.#selectedSticker);
  }

  removeStickerChangeListener (callback) {
    if (!this.#stickerSelectedListeners) return;

    const index = this.#stickerSelectedListeners.indexOf(callback);

    if (index < 0) return;

    this.#stickerSelectedListeners.splice(index, 1);
  }

  #fireStickerChange (sticker = this.#selectedSticker) {
    if (!this.#stickerSelectedListeners) return;

    this.#stickerSelectedListeners.forEach(listenerCallback => {
      listenerCallback(sticker);
    });
  }

  addTrackChangeListener (callback) {
    if (!this.#trackChangeListeners || !callback) return;

    this.#trackChangeListeners.push(callback);

    if (this.#selectedTrack) callback(this.#selectedTrack);
  }

  removeTrackChangeListener (callback) {
    if (!this.#trackChangeListeners || !callback) return;

    const index = this.#trackChangeListeners.indexOf(callback);

    if (index < 0) return;

    this.#trackChangeListeners.splice(index, 1);
  }

  #fireTrackChange (track = this.#selectedTrack) {
    if (!this.#trackChangeListeners) return;

    this.#trackChangeListeners.forEach(listenerCallback => {
      listenerCallback(track);
    });
  }

  #stopCurrentTrack () {
    this.#selectedTrack.audio?.pause();
  }

  setSticker (stickerIndex = -1) {
    if (this.#selectedSticker) {
      if (this.#selectedSticker.index === stickerIndex) return this.#selectedSticker;

      if (!this.#selectedSticker.animation.jsonLoaded) return this.#selectedSticker;

      releaseAnimation(this.#selectedSticker);
    }

    this.#selectedSticker = this.#stickersController.getList()[stickerIndex];

    this.#fireStickerChange();

    if (!this.#selectedSticker) return this.#selectedSticker;

    if (!this.#selectedSticker.animation.jsonLoaded) {
      this.#stickersController.loadAnimation(this.#selectedSticker).then(sticker => {
        this.#fireStickerChange(sticker);
      }).catch(console.error);
    }

    return this.#selectedSticker;
  }

  setTrack (trackId, play = true) {
    if (this.#selectedTrack) {
      if (this.#selectedTrack.trackId === trackId) return;

      this.#stopCurrentTrack();
    }

    this.#musicController.getTrack(trackId).then(track => {
      // #release may have been called already, so check!
      if (!this.#musicController) return;

      this.#selectedTrack = track;

      if (play) this.#musicController.playTrack(track);

      this.#fireTrackChange();
    });
  }

  logPair (stickerId, trackId) {
    if (ON_DEVELOPMENT) return;

    const reqInit = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        stickerId: stickerId,
        trackId: trackId
      })
    };

    post(POSTS_URL + 'posts', reqInit).catch(console.error);
  }

  music () {
    return this.#musicController;
  }

  stickers () {
    return this.#stickersController;
  }
}

const ds = new DancingStickers();

export default ds;
