import React, { useState } from 'react';
import DancingStickers from '../../../../ds-api/write';
import { getStickersByEmojiSet } from '../../../../ds-api/common/stickers';

import StickersList from './stickers-list';
import EmojisSelector from './emojis-selector';

import * as style from './style.scss';

function StickerPicker () {
  const stickersList = DancingStickers.stickers().getList();

  const [stickersSubset, setStickersSubset] = useState([]);

  const onEmojiSelected = (emojiSet, mask) => {
    const subset = getStickersByEmojiSet(stickersList, emojiSet, mask);

    setStickersSubset(subset);
  };

  if (!stickersList) {
    return (
      <div className={style.box}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={style.stickerPickerCont}>
      <EmojisSelector onChange={onEmojiSelected} />
      <StickersList list={stickersSubset} />
    </div>
  );
}

export default StickerPicker;
