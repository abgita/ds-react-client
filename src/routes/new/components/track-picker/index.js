import React, { useEffect, useState } from 'react';

import DancingStickers from '../../../../ds-api/write';

import Track from './track';
import TrackSearch from './track-search';

import * as style from './style.scss';

function TrackPicker () {
  const [track, setTrack] = useState();

  useEffect(() => {
    DancingStickers.addTrackChangeListener(setTrack);

    return () => {
      DancingStickers.removeTrackChangeListener(setTrack);
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
