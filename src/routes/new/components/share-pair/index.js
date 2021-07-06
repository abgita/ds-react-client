import React from 'react';
import PropTypes from 'prop-types';
import { RWebShare } from 'react-web-share';

import Pair from '../../components/pair';
import ColoredButton from '../../../../components/colored-button';

import * as style from './style.scss';

export default function SharePair ({ pair, onBack }) {
  const shareLink = `https://url.dsticker.me/${pair.id}`;

  const shareData = {
    text: '...',
    url: shareLink,
    title: 'Share 💬 🌐'
  };

  const shareSites = ['facebook', 'twitter', 'whatsapp', 'telegram', 'linkedin', 'mail', 'copy'];

  const shareButtonColor = pair.sticker.colors[1];

  return (
    <Pair pair={pair}>
      <div className={style.buttons}>
        <ColoredButton rgb={pair.sticker.colors[3]} onPress={onBack}>
          Home
        </ColoredButton>

        <RWebShare data={shareData} sites={shareSites}>
          <ColoredButton rgb={shareButtonColor}>
            <div className={style.buttons}>
              Share
            </div>
          </ColoredButton>
        </RWebShare>
      </div>
    </Pair>
  );
}

SharePair.propTypes = {
  pair: PropTypes.object,
  onBack: PropTypes.func
};
