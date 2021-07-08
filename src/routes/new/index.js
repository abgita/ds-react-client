import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DancingStickers from '../../ds-api/write';
import { withRouter } from 'react-router-dom';

import NewPair from './components/new-pair';
import LoadingScreen from '../../components/loading-screen';
import SharePair from './components/share-pair';
import { changeBackground } from '../../utils/backgroundColor';
import { releaseAnimation } from '../../ds-api/common/stickers/lottie';
import { useWrappedEffect } from '../../utils/react-custom-hooks';

function New ({ history }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pair, setPair] = useState(null);

  useWrappedEffect(callback => {
    DancingStickers.init().then(callback(() => {
      setReady(true);

      // give it some time to render the NewPair component, behind the loading screen
      setTimeout(callback(() => {
        setLoading(false);
      }), 1000);

      DancingStickers.addStickerChangeListener(changeBackground);
    }));

    changeBackground();

    return () => {
      DancingStickers.release();
    };
  }, []);

  const onNewPairCreated = async (sticker, track) => {
    releaseAnimation(sticker);

    DancingStickers.logPair(sticker.uniqueId, track.trackId);

    const pair = {
      sticker: sticker,
      track: track,
      id: sticker.uniqueId + ':' + track.trackId
    };

    setPair(pair);
  };

  const onBackPressed = async () => {
    DancingStickers.setSticker();
    DancingStickers.setTrack();

    history.push('/');
  };

  let screen;

  if (ready) {
    if (!pair) {
      screen = <NewPair onCompleted={onNewPairCreated} />;
    } else {
      screen = <SharePair onBack={onBackPressed} pair={pair} />;
    }
  }

  if (loading) {
    return (
      <>
        {screen}

        <LoadingScreen />
      </>
    );
  } else {
    return screen;
  }
}

export default withRouter(New);

New.propTypes = {
  history: PropTypes.object
};
