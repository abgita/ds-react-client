import React, { useEffect, useRef } from 'react';

import { loadAnimationFromFile } from '../../ds-api/common/stickers/lottie';
import { getCssLinearGradient } from '../../colors';
import { getRandomAnimation } from './loading-animations';

import * as style from './style.scss';

function setParentElementBackground (color) {
  const element = document.querySelector('.' + style.loadingScreen);

  element.style.backgroundImage = getCssLinearGradient(color, 35, 0);
}

export default function LoadingScreen () {
  const ref = useRef();

  useEffect(() => {
    const animation = getRandomAnimation();

    setParentElementBackground(animation.color);

    const filePath = `/lottie/${animation.fileName}.json`;
    const instance = loadAnimationFromFile(ref.current, filePath, true, true);

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <div className={style.loadingScreen}>
      <div ref={ref} className={style.loadingScreenAnim} />
    </div>
  );
}
