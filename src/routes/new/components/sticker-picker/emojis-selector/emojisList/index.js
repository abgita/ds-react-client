import React, { useState } from 'react';
import PropTypes from 'prop-types';
import emojis from './emojis';
import LottieEmoji from './lottieEmoji';

import * as style from './style.scss';

export default function EmojisList ({ onSelect }) {
  const [selectedEmoji, setSelectedEmoji] = useState();

  const onClick = (emoji) => {
    onSelect(emoji);

    setSelectedEmoji(emoji);
  };

  const emojiList = [];

  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i];

    const { codePoint, set } = emoji;

    const onClickCallback = onClick.bind(this, emoji);

    const isSelected = selectedEmoji === emoji;
    const className = style.li + ' ' + (isSelected ? style.liSelected : '');

    const li = (
      <li className={className} key={codePoint} onClick={onClickCallback}>
        <LottieEmoji emoji={set[0]} selected={isSelected} />
      </li>
    );

    emojiList.push(li);
  }

  return <ul className={style.ul}>{emojiList}</ul>;
}

EmojisList.propTypes = {
  onSelect: PropTypes.func
};
