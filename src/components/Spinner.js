import PropTypes from 'prop-types';
import React from 'react';
import './spinner.scss';

Spinner.propTypes = {
  show: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string
};

Spinner.defaultProps = {
  show: true,
  size: '',
  className: ''
};

export default function Spinner(props) {
  if (!props.show) {
    return <span/>;
  }
  let className = 'loader';
  if (props.className) {
    className += ` ${props.className}`;
  }
  if (props.size) {
    className += ` ${props.size}`;
  }
  return (
    <span aria-label="In progess" className={className} />
  );
}
