import { loadStickerAnimation } from './lottie.js';

jest.mock('lottie-web', () => {
  return {
    loadAnimation: _ => {
      return {
        addEventListener: (eventName, callback) => {
          if (callback) setTimeout(callback);
        },
        removeEventListener: () => {},
        play: () => {},
        destroy: () => {}
      };
    }
  };
});

const lottieContElement = {};

const stickerMock = {
  animation: {
    instance: null,
    jsonLoaded: true
  }
};

let stickerAnimationMock;

beforeEach(() => {
  stickerAnimationMock = { ...stickerMock.animation };
});

it('loads correctly on first call', () => {
  const onLoadedMock = jest.fn(lottiePlayer => {
    expect(onLoadedMock.mock.calls.length).toBe(1);

    expect(lottiePlayer).toHaveProperty('play');
    expect(lottiePlayer).toHaveProperty('destroy');
    expect(lottiePlayer.play).toBeInstanceOf(Function);
  });

  return loadStickerAnimation(lottieContElement, stickerAnimationMock).then(onLoadedMock);
});

it('throws when json is not loaded', () => {
  expect.assertions(1);

  stickerAnimationMock.jsonLoaded = false;

  return loadStickerAnimation(lottieContElement, stickerAnimationMock).catch(error => {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error).toStrictEqual(Error('lottie file is not loaded'));
  });
});

it('returns same instance if it\'s defined', () => {
  stickerAnimationMock.instance = {
    am: {
      i: 'already loaded?'
    }
  };

  const onLoadedMock = jest.fn(lottiePlayer => {
    expect(onLoadedMock.mock.calls.length).toBe(1);

    expect(lottiePlayer).toHaveProperty('am.i');
  });

  return loadStickerAnimation(lottieContElement, stickerAnimationMock).then(onLoadedMock);
});
