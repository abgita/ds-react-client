import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getTop } from '../../../ds-api/common/posts';
import { withRouter } from 'react-router-dom';

import * as style from './style.scss';

function Item ({ thumb, trackName, trackArtist, emojis, usageCount, onClick }) {
  return (
    <li className={style.topItem} onClick={onClick}>
      <div className={style.topItemThumb}>
        <img src={thumb} loading='lazy' />
      </div>

      <div className={style.trackMetadata}>
        <div className={style.topItemTrack}>
          <p className={style.topItemTrackName} title={trackName}>{trackName}</p>
          <p className={style.topItemTrackArtist} title={trackArtist}>{trackArtist}</p>
          <p className={style.topItemUsage}>{emojis} {usageCount} times selected</p>
        </div>

        <div className={style.trackSpotifyIcon} />
      </div>
    </li>
  );
}

Item.propTypes = {
  thumb: PropTypes.string,
  trackName: PropTypes.string,
  trackArtist: PropTypes.string,
  emojis: PropTypes.any,
  usageCount: PropTypes.any,
  onClick: PropTypes.func
};

function TopPairs (props) {
  const [pairs, setPairs] = useState(null);

  useEffect(() => {
    let mounted = true;

    getTop().then(async latest => {
      if (!mounted) return;

      setPairs(latest);
    }).catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  const list = [];

  if (pairs) {
    for (let i = 0; i < pairs.length; i++) {
      const post = pairs[i];

      // eslint-disable-next-line no-inner-declarations
      function onClick () {
        props.history.push(`/view/${post.id}?autoplay=1`);
      }

      const li = (
        <Item
          key={post.index}
          onClick={onClick}
          thumb={post.sticker.thumbFile.imgSrc}
          trackName={post.track?.trackName}
          trackArtist={post.track?.artistName}
          emojis={post.sticker.emojis}
          usageCount={post.usage}
        />
      );

      list.push(li);
    }
  } else {
    const thumbSrc = '/images/lottie.svg';

    for (let i = 0; i < 5; i++) {
      const li = (
        <Item
          key={'top-item-n' + i}
          thumb={thumbSrc}
          trackName='Track'
          trackArtist='Artist'
          emojis='💃'
          usageCount={(i + 1) * 10}
        />
      );

      list.push(li);
    }
  }

  return (
    <div className={style.topCont}>
      <ul>{list}</ul>
    </div>
  );
}

export default withRouter(TopPairs);

TopPairs.propTypes = {
  history: PropTypes.object
};
