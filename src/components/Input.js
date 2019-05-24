import inputable from './Inputable';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

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
  style: {},
  className: 'form-control',
  onBlur: () => {},
  placeholder: '',
  type: 'text',
};

export function Input({ type, onChange, controlled, value, dataIdentifier, inputRef, ...rest }) {
  function handleChange(ev) {
    if (!onChange) return;
    let val = ev.target.value;
    val = type === 'number' ? ensurePositiveNumber(val) : val;
    onChange(val);
  }
  return (
    <input
      type={type}
      value={controlled && _.isNil(value) ? '' : value}
      data-identifier={dataIdentifier}
      ref={inputRef}
      onChange={handleChange}
      {...rest}
    />
  );
}

const Inputable = inputable(Input);
Inputable.propTypes = propTypes;
Inputable.defaultProps = defaultProps;
export default Inputable;

function ensurePositiveNumber(amount) {
  if (amount === '') return '';
  amount = parseInt(amount, 10);
  return isNaN(amount) || amount < 0 ? 0 : amount;
}
