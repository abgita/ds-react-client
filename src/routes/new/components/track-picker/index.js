import React, { useState } from 'react';

import DancingStickers from '../../../../ds-api/write';

import Track from './track';
import TrackSearch from './track-search';

import * as style from './style.scss';
import { useWrappedEffect } from '../../../../utils/react-custom-hooks';

function TrackPicker () {
  const [track, setTrack] = useState();

  useWrappedEffect(callback => {
    const onTrackChange = callback(setTrack);

    DancingStickers.addTrackChangeListener(onTrackChange);

    return () => {
      DancingStickers.removeTrackChangeListener(onTrackChange);
    };
  }, []);

  function onTrackSelect (trackId) {
    DancingStickers.setTrack(trackId);
  }

  return (
    <div className={style.trackPickerCont}>
      <TrackSearch onSelect={onTrackSelect} />
      <Track track={track} />
    </div>
  );
}

export default TrackPicker;
