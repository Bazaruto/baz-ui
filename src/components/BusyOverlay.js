import PropTypes from 'prop-types';
import React from 'react';

BusyOverlay.propTypes = {
  show: PropTypes.bool,
};

BusyOverlay.defaultProps = {
  show: true,
};

export default function BusyOverlay(props) {
  if (!props.show) {
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
