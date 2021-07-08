import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { getLatest } from '../../../ds-api/common/posts';
import { withRouter } from 'react-router-dom';
import ScrollContainer from 'react-indiana-drag-scroll';

import * as style from './style.scss';
import { useWrappedEffect } from '../../../utils/react-custom-hooks';

function Item ({ thumb, trackName, trackArtist, onClick }) {
  return (
    <li className={style.topItem} onClick={onClick}>
      <div className={style.topItemThumb}>
        <img src={thumb} loading='lazy' alt='sticker thumb preview' />
      </div>

      <div className={style.trackMetadata}>
        <div className={style.trackSpotifyIcon} />

        <div className={style.topItemTrack}>
          <p className={style.topItemTrackName} title={trackName}>{trackName}</p>
          <p className={style.topItemTrackArtist} title={trackArtist}>{trackArtist}</p>
        </div>
      </div>
    </li>
  );
}

Item.propTypes = {
  thumb: PropTypes.string,
  trackName: PropTypes.string,
  trackArtist: PropTypes.string,
  onClick: PropTypes.func
};

function LatestPosts (props) {
  const [posts, setPosts] = useState(null);

  useWrappedEffect(callback => {
    getLatest().then(callback(setPosts)).catch(console.error);
  }, []);

  const list = [];

  if (posts) {
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

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
        />
      );

      list.push(li);
    }
  } else {
    const thumbSrc = '/images/lottie.svg';

    for (let i = 0; i < 8; i++) {
      const li = <Item key={'latest-item-n' + i} thumb={thumbSrc} trackName='Track' trackArtist='Artist' />;

      list.push(li);
    }
  }

  return (
    <div className={style.topCont}>
      <ScrollContainer className={style.topListCont}>
        <ul>{list}</ul>
      </ScrollContainer>
    </div>
  );
}

export default withRouter(LatestPosts);

LatestPosts.propTypes = {
  history: PropTypes.object
};
