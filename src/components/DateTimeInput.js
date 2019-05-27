import PropTypes from 'prop-types';
import React from 'react';
import Inputable from './Inputable';
import InputDatePicker from './InputDatePicker';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  minValue: PropTypes.string,
  maxValue: PropTypes.string,
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

  showTimePicker: PropTypes.bool,
  viewMode: PropTypes.string,
  clearable: PropTypes.bool,
  onClear: PropTypes.func
};

const defaultProps = {
  value: ''
};

let DateTimeInput = ({ onChange, value, minValue, maxValue, name, clearable, onClear, ...rest }) => (
  <div className={`input-date-picker ${clearable ? 'input-group' : ''}`}>
    <InputDatePicker
      identifier={name}
      startDate={value}
      minDate={minValue}
      maxDate={maxValue}
      onApply={onChange}
      {...rest}
    />
    {clearable &&
      <span className="input-group-btn">
        <button className="btn btn-default" onClick={onClear}>
          <span className="glyphicon glyphicon-remove"></span>
        </button>
      </span>
    }
  </div>
);

DateTimeInput = Inputable(DateTimeInput);
DateTimeInput.propTypes = propTypes;
DateTimeInput.defaultProps = defaultProps;
export default DateTimeInput;

