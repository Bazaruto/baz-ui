import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.node,
  ]).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClick: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  btnType: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  dataIdentifier: PropTypes.string,
};

const defaultProps = {
  btnType: 'primary'
}

export default function SpinnerButton({ children, btnType, className, submitting, disabled, dataIdentifier, ...buttonProps }) {
  return (
    <button
      {...buttonProps}
      className={`btn btn-${btnType} loader-button ${className || ''} ${submitting ? 'loading' : ''}`}
      disabled={submitting || disabled}
      data-identifier={dataIdentifier}
    >
      {children}
      <span className="spinner-container">
        <Spinner size="small" />
      </span>
    </button>
  );
}

SpinnerButton.propTypes = propTypes;
SpinnerButton.defaultProps = defaultProps;
