import React from 'react';
import PropTypes from 'prop-types';
import ScrollContainer from 'react-indiana-drag-scroll';
import EmojisList from './emojisList';

import * as style from './style.scss';

export default function EmojisSelector ({ onChange }) {
  const onEmojiSelected = function (emoji) {
    onChange(emoji.set, emoji.mask);
  };

  return (
    <div className={style.main}>
      <div className={style.scroll}>
        <ScrollContainer className={style.emojis} vertical={false}>
          <EmojisList onSelect={onEmojiSelected} />
        </ScrollContainer>
      </div>
    </div>
  );
}

EmojisSelector.propTypes = {
  onChange: PropTypes.func
};
