import React from 'react';
import PropTypes from 'prop-types';

import * as style from './style.scss';
import ColoredButton from '../colored-button';

export default function ShareButton ({ link, children }) {
  return (
    <div className={style.homeButton}>
      <a href={link}>
        <ColoredButton rgb={[30, 30, 30]}>{children}</ColoredButton>
      </a>
    </div>
  );
}

ShareButton.propTypes = {
  link: PropTypes.string,
  children: PropTypes.any
};
