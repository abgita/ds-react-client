import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { loadStickerAnimation } from '../../ds-api/common/stickers/lottie';

import * as style from './style.scss';

function AnimationViewer ({ children, lottieContRef, large, loaded }) {
  const sizeClass = large ? style.animViewerLarge : style.animViewerSmall;

  return (
    <div className={style.animViewerCont}>
      <div className={style.animViewer + ' ' + sizeClass}>
        {children}
        <div ref={lottieContRef} className={loaded ? style.visible : style.hidden} />
      </div>
    </div>
  );
}

AnimationViewer.propTypes = {
  lottieContRef: PropTypes.any,
  large: PropTypes.bool,
  children: PropTypes.any
};

const LOTTIE_IMAGE_SRC = '/images/lottie.svg';

export default function StickerAnimation ({ large = true, controller, loop = true }) {
  const [loaded, setLoaded] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(LOTTIE_IMAGE_SRC);

  const lottieContRef = useRef();

  useEffect(() => {
    let isThumbLoading = false;
    let lottieThumbTimer;

    const stickerChangeCallback = sticker => {
      if (sticker) {
        loadStickerAnimation(lottieContRef.current, sticker.animation, loop).then(lottiePlayer => {
          setLoaded(true);

          lottiePlayer.play();
        }).catch(() => {
          if (isThumbLoading) return;

          const thumbSrc = sticker.thumbFile.imgSrc;

          const thumb = new Image();

          thumb.onload = () => {
            isThumbLoading = false;

            if (lottieThumbTimer) {
              clearTimeout(lottieThumbTimer);

              lottieThumbTimer = null;

              setLoaded(false);
            }

            setThumbSrc(thumb.src);
          };

          thumb.src = thumbSrc;

          isThumbLoading = true;

          lottieThumbTimer = setTimeout(() => {
            setLoaded(false);
            setThumbSrc(LOTTIE_IMAGE_SRC);

            lottieThumbTimer = null;
          }, 200);
        });
      } else {
        setLoaded(false);
        setThumbSrc(LOTTIE_IMAGE_SRC);
      }
    };

    controller.addStickerChangeListener(stickerChangeCallback);

    return () => {
      if (lottieThumbTimer) clearTimeout(lottieThumbTimer);

      controller.removeStickerChangeListener(stickerChangeCallback);
    };
  }, [controller, loop]);

  return (
    <AnimationViewer loaded={loaded} lottieContRef={lottieContRef} large={large}>
      {loaded ? null : <img src={thumbSrc} alt='Loading...' />}
    </AnimationViewer>
  );
}

StickerAnimation.propTypes = {
  large: PropTypes.bool,
  controller: PropTypes.object,
  loop: PropTypes.bool
};
