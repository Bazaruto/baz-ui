import PropTypes from 'prop-types';
import React from 'react';
import Spinner from './Spinner';
import './busy-overlay.scss';

BusyOverlay.propTypes = {
  show: PropTypes.bool,
  showSpinner: PropTypes.bool,
  spinnerSize: PropTypes.string,
  padded: PropTypes.bool
};

BusyOverlay.defaultProps = {
  show: true,
  spinnerSize: 'medium',
  padded: true
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
      {props.showSpinner &&
        <div className="center">
          <Spinner size={props.spinnerSize} className={props.padded ? 'margin-top' : null}/>
        </div>
      }
      {props.children}
    </div>
  );
}
