import PropTypes from 'prop-types';
import React from 'react';

Spinner.propTypes = {
  show: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string
};

Spinner.defaultProps = {
  show: true,
};

export default function Spinner(props) {
  const { show, size, ...rest } = props;
  if (!show) {
    return null;
  }
  let className = 'loader';
  if (props.className) {
    className += ` ${props.className}`;
  }
  if (size) {
    className += ` ${size}`;
  }
  return <span aria-hidden data-identifier="busy-spinner" {...rest} className={className} />;
}
