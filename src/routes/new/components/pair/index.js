import DancingStickers from '../../../../ds-api/write';

import React from 'react';
import PropTypes from 'prop-types';

import Track from '../../../../components/track';
import StickerAnimation from '../../../../components/sticker';

import { pairViewCont } from './style.scss';

export default function PairView ({ pair, children }) {
  return (
    <div className={pairViewCont}>
      <StickerAnimation large controller={DancingStickers} />
      <Track track={pair.track} onTop />

      {children}
    </div>
  );
}

PairView.propTypes = {
  pair: PropTypes.object,
  children: PropTypes.any
};
