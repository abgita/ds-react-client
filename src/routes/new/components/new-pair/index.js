import React, { useState } from 'react';
import PropTypes from 'prop-types';

import StickerAnimation from '../../../../components/sticker';
import TrackPicker from '../track-picker';
import StickerPicker from '../sticker-picker';
import ColoredButton from '../../../../components/colored-button';

import * as style from './style.scss';
import DancingStickers from '../../../../ds-api/write';
import { useWrappedEffect } from '../../../../utils/react-custom-hooks';

export default function NewPair ({ onCompleted }) {
  const [sticker, setSticker] = useState(null);
  const [track, setTrack] = useState(null);

  useWrappedEffect(callback => {
    const onStickerChange = callback(setSticker);
    const onTrackChange = callback(setTrack);

    DancingStickers.addStickerChangeListener(onStickerChange);
    DancingStickers.addTrackChangeListener(onTrackChange);

    return () => {
      DancingStickers.removeStickerChangeListener(onStickerChange);
      DancingStickers.removeTrackChangeListener(onTrackChange);
    };
  }, []);

  const onClick = () => {
    onCompleted(sticker, track);
  };

  const isFormReady = sticker != null && track?.trackId;
  const buttonColor = isFormReady ? sticker.colors[1] : [180, 180, 180];

  return (
    <div className={style.createCont}>
      <section className={style.createPage} role='form' aria-label='dancing sticker creation section'>
        <TrackPicker />

        <div className={style.stickerTrackCont}>
          <StickerAnimation large={false} controller={DancingStickers} />

          <StickerPicker />
        </div>

        <ColoredButton isDisabled={!isFormReady} rgb={buttonColor} onPress={onClick}>
          Submit
        </ColoredButton>
      </section>
    </div>
  );
}

NewPair.propTypes = {
  onCompleted: PropTypes.func
};
