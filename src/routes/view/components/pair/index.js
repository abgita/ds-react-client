import DancingStickersPair from '../../../../ds-api/read';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Track from '../../../../components/track';
import StickerAnimation from '../../../../components/sticker';

import { pairViewCont } from './style.scss';
import { changeBackground } from '../../../../utils/backgroundColor';
import { useWrappedEffect } from '../../../../utils/react-custom-hooks';

export default function Pair ({ stickerId, trackId, isPlaying }) {
  const [pair, setPair] = useState({});

  useWrappedEffect(callback => {
    DancingStickersPair.load(stickerId, trackId).then(callback(pair => {
      changeBackground(pair?.sticker);

      setPair(pair);
    }));

    return () => {
      DancingStickersPair.dispose();
    };
  }, [stickerId, trackId]);

  const onVolumeTogglePressed = (volumeUp) => {
    if (volumeUp) {
      DancingStickersPair.unmuteTrack();
    } else {
      DancingStickersPair.muteTrack();
    }
  };

  return (
    <div className={pairViewCont}>
      <StickerAnimation large controller={DancingStickersPair} />
      <Track track={pair.track} onTop volumeUp={isPlaying} onVolumeToggle={onVolumeTogglePressed} />
    </div>
  );
}

Pair.propTypes = {
  stickerId: PropTypes.string,
  trackId: PropTypes.string,
  isPlaying: PropTypes.bool
};
