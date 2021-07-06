import React from 'react';
import PropTypes from 'prop-types';

import * as style from './style.scss';

const defaultTrack = {
  albumCover: '/images/empty.png',
  trackName: 'Song',
  artistName: 'Artist',
  spotifyLink: '#',
  isPlayable: true
};

export default function Track (props) {
  const track = props.track || defaultTrack;

  const title = track.isPlayable ? undefined : 'Preview not available';

  return (
    <div className={style.trackPickerPreview}>
      <div className={style.trackPickerPreviewAlbumCover}>
        <img src={track.albumCover} alt='Album cover image' />
      </div>

      <div className={style.trackPickerPreviewMetadataCont}>
        <div className={style.trackPickerPreviewMetadata}>
          <div className={style.trackPickerPreviewMetadataTopCont}>
            <div className={style.trackPickerPreviewName}>{track.trackName}</div>
            <div
              className={
                        style.trackPickerPreviewPlayableIcon +
                        ' ' +
                        (track.isPlayable ? style.trackPickerPreviewPlayableTrue : style.trackPickerPreviewPlayableFalse)
                    } title={title}
            />
          </div>

          <div className={style.trackPickerPreviewArtist}>{track.artistName}</div>
        </div>

        <div className={style.trackPickerPreviewLink}>
          <a className='nostyle' target='_blank' rel='noreferrer' href={track.spotifyLink}>PLAY ON SPOTIFY</a>

          <div className={style.trackPickerPreviewLinkSpotifyLogo} />
        </div>
      </div>
    </div>
  );
}

Track.propTypes = {
  track: PropTypes.object
};
