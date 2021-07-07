import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { loadAnimationFromFile } from '../../../../../../../ds-api/common/stickers/lottie';

import * as style from './style.scss';

export default function LottieEmoji ({ emoji, selected }) {
  const ref = useRef();

  useEffect(() => {
    const filePath = `/lottie/emojis/${emoji}.json`;
    const instance = loadAnimationFromFile(ref.current, filePath, true, selected);

    return () => {
      instance.destroy();
    };
  }, [selected, emoji]);

  return <div ref={ref} className={style.emojiAnimation} />;
}

LottieEmoji.propTypes = {
  emoji: PropTypes.string,
  selected: PropTypes.bool
};
