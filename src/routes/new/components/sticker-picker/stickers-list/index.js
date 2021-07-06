import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import DancingStickers from '../../../../../ds-api/write';
import ScrollContainer from 'react-indiana-drag-scroll';

import * as style from './style.scss';
import { getCssLinearGradient } from '../../../../../colors';

function StickerThumb ({ sticker }) {
  const thumb = sticker.thumbFile.imgSrc;
  const packName = sticker.stickerPack;
  const imgSrc = !thumb ? '/images/telegram.svg' : thumb;

  const gradientColor = sticker.colors ? sticker.colors[2] : [255, 255, 255];

  return (
    <img
      loading='lazy'
      width='64'
      height='64'
      style={{ backgroundImage: getCssLinearGradient(gradientColor, 45, 120) }}
      className={style.slThumb}
      src={imgSrc}
      alt={packName}
    />
  );
}

StickerThumb.propTypes = {
  sticker: PropTypes.object
};

function StickersList ({ limit, list }) {
  const [selectedStickerId, setSelectedStickerId] = useState();
  const scrollCont = useRef(null);

  useEffect(() => {
    if (scrollCont.current) scrollCont.current.scrollTo(0, 0);
  }, [list]);

  const onClick = function (sticker) {
    const selectedSticker = DancingStickers.setSticker(sticker.index);

    setSelectedStickerId(selectedSticker?.uniqueId);
  };

  const items = list.slice(0, limit).map((sticker) => {
    const stickerId = sticker.uniqueId;
    const selected = selectedStickerId === stickerId;

    return (
      <li key={stickerId} onClick={onClick.bind(this, sticker)}>
        <StickerThumb sticker={sticker} selected={selected} />
      </li>
    );
  });

  const ul = <ul className={style.slUl}>{items}</ul>;
  const scroll = <ScrollContainer className={style.slScrollContainer} innerRef={scrollCont}>{ul}</ScrollContainer>;

  const selectEmoji = <div className={style.selectEmoji}>Select an emoji</div>;

  const listContent = items.length > 0 ? scroll : selectEmoji;

  return (
    <div className={style.cont}>
      <div className={style.bg} />
      <div className={style.listCont}>{listContent}</div>
    </div>
  );
}

export default StickersList;

StickersList.propTypes = {
  limit: PropTypes.number,
  list: PropTypes.array
};
