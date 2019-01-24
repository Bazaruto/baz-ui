import inputable from './Inputable';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

const propTypes = {
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
};

const defaultProps = {
  style: {},
  className: 'form-control',
  onBlur: () => {},
  placeholder: '',
  type: 'text',
};

export function Input({ type, controlled, value, dataIdentifier, inputRef, ...rest }) {
  return (
    <input
      type={type}
      value={controlled && _.isNil(value) ? '' : value}
      data-identifier={dataIdentifier}
      ref={inputRef}
      {...rest}
    />
  );
}

const Inputable = inputable(Input);
Inputable.propTypes = propTypes;
Inputable.defaultProps = defaultProps;
export default Inputable;
