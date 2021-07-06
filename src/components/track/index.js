import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useButton } from '@react-aria/button';

import * as style from './style.scss';

const defaultTrack = {
  albumCover: '/images/empty.png',
  trackName: 'Song',
  artistName: 'Artist',
  spotifyLink: '#',
  isPlayable: true
};

function Alert () {
  const title = 'Preview not available';

  return <div className={style.trackPlayableIcon} title={title} />;
}

function VolumeToggle ({ up = false, onToggle }) {
  const [isUp, setUp] = useState(up);
  const ref = useRef();

  const { buttonProps } = useButton({
    onPress: () => {
      const state = !isUp;

      setUp(state);

      if (onToggle) onToggle(state);
    }
  }, ref);

  return (
    <button
      ref={ref}
      {...buttonProps}
      className={
            style.trackVolumeButton + ' ' +
            (isUp ? style.trackVolumeUp : style.trackVolumeOff)
        }
    />
  );
}

VolumeToggle.propTypes = {
  up: PropTypes.bool,
  onToggle: PropTypes.func
};

export default function Track ({ track = defaultTrack, onTop = false, volumeUp = false, onVolumeToggle }) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const contClassName = getContClassName(style.trackPreviewCont, onTop, isVisible);

  const isTrackPlayable = track.isPlayable;

  return (
    <div className={contClassName}>
      <div className={style.trackPreview}>
        <div className={style.trackAlbumCover}>
          <img src={track.albumCover} alt='Album cover image' />
        </div>

        <div className={style.trackMetadataCont}>
          <div className={style.trackMetadata}>
            <div className={style.trackMetadataTopCont}>
              <div className={style.trackName}>{track.trackName}</div>

              {
                isTrackPlayable
                  ? (
                      onVolumeToggle
                        ? <VolumeToggle up={volumeUp} onToggle={onVolumeToggle} />
                        : null
                    )
                  : <Alert />
              }
            </div>

            <div className={style.trackArtist}>{track.artistName}</div>
          </div>

          <div className={style.trackLink}>
            <a className='nostyle' target='_blank' rel='noreferrer' href={track.spotifyLink}>PLAY ON SPOTIFY</a>

            <div className={style.trackLinkSpotifyLogo} />
          </div>
        </div>
      </div>
    </div>
  );
}

Track.propTypes = {
  track: PropTypes.object,
  onTop: PropTypes.bool,
  volumeUp: PropTypes.bool,
  onVolumeToggle: PropTypes.func
};

// returns a different class name whether 'onTop' and 'isVisible' args are true or not
function getContClassName (className, onTop, isVisible) {
  let res = className;

  if (isVisible) {
    if (onTop) {
      res += ` ${style.trackPreviewContVisibleTop}`;
    } else {
      res += ` ${style.trackPreviewContVisibleBottom}`;
    }
  }

  return onTop ? res + ` ${style.trackPreviewContTop}` : res;
}
