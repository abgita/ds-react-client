import { ON_DEVELOPMENT } from '../../../config';

let lottie = null;

const defaultConfig = (lottieContElement) => {
  return {
    container: lottieContElement,
    renderer: 'svg',
    rendererSettings: {
      progressiveLoad: true
    }
  };
};

async function getLottie () {
  if (lottie !== null) return lottie;

  try {
    const { default: module } = await import(
      /* webpackChunkName: "lottie" */
      /* webpackPreload: true */
      'lottie-web'
    );

    lottie = module;

    lottie.setQuality('low');
  } catch (error) {
    if (ON_DEVELOPMENT) console.log(error);
  }

  return lottie;
}

function loadAnimation (options, onLoaded) {
  let destroyed = false;
  let instance = null;

  getLottie().then(lottie => {
    if (destroyed) return;

    instance = lottie.loadAnimation(options);

    if (onLoaded) {
      const listener = () => {
        try {
          onLoaded();
        } catch (error) {
          if (ON_DEVELOPMENT) console.log(error);
        }

        instance?.removeEventListener(listener);
      };

      instance.addEventListener('DOMLoaded', listener);
    }
  });

  return {
    play () {
      instance?.play();
    },

    destroy () {
      destroyed = true;

      if (instance == null) return;

      try {
        instance.destroy();
        instance = null;
      } catch (ignored) {
      }
    }
  };
}

export function loadAnimationFromFile (lottieContElement, filePath, loop = true, autoplay = false) {
  return loadAnimation({
    loop: loop,
    autoplay: autoplay,
    path: filePath,
    ...defaultConfig(lottieContElement)
  });
}

export function loadStickerAnimation (lottieContElement, stickerAnimation, loop = true) {
  if (stickerAnimation.instance) return Promise.resolve(stickerAnimation.instance);
  if (!stickerAnimation.jsonLoaded) return Promise.reject(Error('lottie file is not loaded'));

  return new Promise((resolve, reject) => {
    const lottieAnimation = loadAnimation({
      loop: loop,
      autoplay: false,
      animationData: stickerAnimation.json,
      ...defaultConfig(lottieContElement)
    }, () => {
      resolve(lottieAnimation);
    });

    stickerAnimation.instance = lottieAnimation;
  });
}

export function releaseAnimation (sticker) {
  try {
    // release lottie player resources
    sticker.animation.instance?.destroy();
  } catch (ignored) {
  }

  sticker.animation.instance = null;
}
