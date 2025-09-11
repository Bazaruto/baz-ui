import PropTypes from 'prop-types';
import React from 'react';

BusyOverlay.propTypes = {
  show: PropTypes.bool,
};

export default function BusyOverlay(props) {
  const { show = true} = props;

  if (show) {
    return null;
  }
  let className = 'busy-overlay';
  if (props.colour) {
    className += ` ${props.colour}`;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}
