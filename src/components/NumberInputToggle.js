import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Inputable from './Inputable';
import Input from './Input';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  name: PropTypes.string,
  label: PropTypes.node,
  inlineLabel: PropTypes.node,
  showMessage: PropTypes.bool,
  message: PropTypes.string,
};

function NumberInputToggle(props) {
  const { id, inlineLabel, ...rest } = props;
  return (
    <div className="number-input-toggle-container">
      <div className="number-input-toggle">
        <Input id={id} type="number" {...rest} />
      </div>
      {inlineLabel &&
        <label htmlFor={id} className="toggle-inline-label">
          {inlineLabel}
        </label>
      }
    </div>
  );
}

NumberInputToggle = Inputable(NumberInputToggle);
NumberInputToggle.propTypes = propTypes;
export default NumberInputToggle;
