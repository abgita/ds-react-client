import React from 'react';
import PropTypes from 'prop-types';

import * as style from './style.scss';

const defaultTrack = {
  albumCover: '/images/empty.png',
  trackName: 'Song',
  artistName: 'Artist'
};

export default function TrackItem (props) {
  const track = props.track || defaultTrack;

  return (
    <div className={style.trackItem}>
      <div className={style.trackItemAlbumCover}>
        <img src={track.albumCover} alt='Album cover image' />
      </div>

      <div className={style.trackItemMetadataCont}>
        <div className={style.trackItemMetadata}>
          <div className={style.trackItemName}>{track.trackName}</div>
          <div className={style.trackItemArtist}>{track.artistName}</div>
        </div>
      </div>
    </div>
  );
}

TrackItem.propTypes = {
  track: PropTypes.object
};
