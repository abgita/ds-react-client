import { fetchSticker, newStickerLoader } from '../common/stickers';
import { play, mute } from '../common/tracks/audioTrack';
import { getTrack } from '../common/tracks/spotify-api-proxy';
import { releaseAnimation } from '../common/stickers/lottie';

const defaultTrack = {
  albumCover: './images/empty.png',
  artistName: 'Artist',
  trackName: 'Song',
  spotifyLink: '#',
  isPlayable: false
};

async function setTrack_ (trackId) {
  if (!trackId) return defaultTrack;

  try {
    const track = await getTrack(trackId);

    play(track);

    return track;
  } catch (ignored) {
  }

  return defaultTrack;
}

async function loadSticker_ (stickerId, onAnimationLoaded) {
  const sticker = await fetchSticker(stickerId);

  onAnimationLoaded(sticker);

  const stickerLoader = newStickerLoader();

  stickerLoader.loadAnimation(sticker).then(() => {
    stickerLoader.release();

    onAnimationLoaded(sticker);
  });

  return sticker;
}

export class DancingStickersPair {
    #sticker;
    #track;
    #stickerLoadedCallback;

    async load (stickerId, trackId) {
      const callback = this.#stickerLoadedCallback;

      const onStickerLoadedCallback = (sticker) => {
        if (!callback) return;

        callback(sticker);
      };

      try {
        const loadSticker = loadSticker_(stickerId, onStickerLoadedCallback);
        const setTrack = setTrack_(trackId);

        const res = await Promise.all([loadSticker, setTrack]);

        const pair = {
          sticker: res[0],
          track: res[1]
        };

        this.#sticker = pair.sticker;
        this.#track = pair.track;

        return pair;
      } catch (err) {
        console.error(err);

        return null;
      }
    }

    playTrack () {
      play(this.#track);
    }

    muteTrack () {
      mute(this.#track, true);
    }

    unmuteTrack () {
      const track = this.#track;

      if (track.playing) {
        mute(track, false);
      } else {
        this.playTrack();
      }
    }

    dispose () {
      if (this.#sticker) {
        releaseAnimation(this.#sticker);
      }

      if (this.#track && this.#track.stopAudio) {
        this.#track.stopAudio();
      }

      this.#sticker = null;
      this.#track = null;
      this.#stickerLoadedCallback = null;
    }

    addStickerChangeListener (callback) {
      this.#stickerLoadedCallback = callback;
    }

    removeStickerChangeListener () {
      this.#stickerLoadedCallback = null;
    }
}

const ds = new DancingStickersPair();

export default ds;
