import React from 'react';
import PropTypes from 'prop-types';
import { useButton } from '@react-aria/button';

import { getCssLinearGradient, isColorDark } from '../../colors';

import * as style from './style.scss';

export default function ColoredButton (props) {
  const { rgb, children, alpha = 1 } = props;

  const ref = React.useRef();
  const { buttonProps } = useButton(props, ref);

  const bgImage = getCssLinearGradient(rgb, 15, 90, alpha);

  const textColor = isColorDark(rgb) ? '#FFF' : '#333';

  const inlineStyle = {
    backgroundImage: bgImage,
    color: textColor
  };

  return (
    <div className={style.coloredButtonCont}>
      <button
        className={style.coloredButton}
        ref={ref}
        style={inlineStyle}
        {...buttonProps}
      >
        {children}
      </button>
    </div>
  );
}

ColoredButton.propTypes = {
  rgb: PropTypes.arrayOf(PropTypes.number),
  alpha: PropTypes.number,
  children: PropTypes.any
};
