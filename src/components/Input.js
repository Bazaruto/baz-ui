import inputable from './Inputable';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  name: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  showMessage: PropTypes.bool,
  message: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  dataIdentifier: PropTypes.string,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  index: PropTypes.number,
};

const defaultProps = {
  type: 'text',
  className: 'form-control',
};

export function Input({ inputRef, ...rest }) {
  return (
    <input ref={inputRef} {...rest} />
  );
}

const Inputable = inputable(Input);
Inputable.propTypes = propTypes;
Inputable.defaultProps = defaultProps;
export default Inputable;
