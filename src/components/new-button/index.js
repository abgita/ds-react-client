import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import * as style from './style.scss';
import ColoredButton from '../colored-button';

import { Link } from 'react-router-dom';

const emojis = ['🔥', '😉', '🥰', '😌', '😎', '😡', '😢', '😭', '😕', '🥳', '🤪', '😂', '😤', '💪'];

export default function NewButton ({ fixed = true }) {
  const [emoji, setEmoji] = useState(emojis[0]);

  useEffect(() => {
    const changeEmoji = setInterval(() => {
      const index = Math.floor(Math.random() * emojis.length);

      setEmoji(emojis[index]);
    }, 1500);

    return () => {
      clearInterval(changeEmoji);
    };
  }, []);

  return (
    <div className={style.newButton + ' ' + (fixed ? style.fixed : '')}>
      <div className={style.buttonWidth}>

        <Link to='/new'>
          <ColoredButton alpha={0.8} rgb={[240, 240, 240]}>
            <div className={style.bg} />
            <div className={style.bg + ' ' + style.bg2} />
            <div className={style.bg + ' ' + style.bg3} />
            {emoji} New dancing sticker
          </ColoredButton>
        </Link>
      </div>
    </div>
  );
}

NewButton.propTypes = {
  fixed: PropTypes.bool
};
