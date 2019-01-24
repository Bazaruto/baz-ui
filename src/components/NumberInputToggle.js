import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumberTextInput from '../NumberTextInput';
import Inputable from './Inputable';

const propTypes = {
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

class NumberInputToggle extends Component {
  handleIncrease = () => {
    const { value, onChange } = this.props;
    onChange(value + 1);
  };

  handleDecrease = () => {
    const { value, onChange } = this.props;
    if (!value) {
      return;
    }
    onChange(value - 1);
  };

  render() {
    const { value, name, inlineLabel, onChange } = this.props;
    return (
      <div className="number-input-toggle-container">
        <div className="number-input-toggle">
          <div className="input-group light-theme">
            <NumberTextInput
              className="form-control"
              onChange={onChange}
              value={value}
              name={name}
            />
            <div className="input-group-btn-vertical">
              <button data-id={`${name}-incr`} className="btn blank-button btn-default" onClick={this.handleIncrease}>▲</button>
              <button data-id={`${name}-decr`} className="btn blank-button btn-default" onClick={this.handleDecrease}>▼</button>
            </div>
          </div>
        </div>
        {inlineLabel &&
          <div className="toggle-inline-label">
            {inlineLabel}
          </div>
        }
      </div>
    );
  }
}

NumberInputToggle = Inputable(NumberInputToggle);
NumberInputToggle.propTypes = propTypes;
export default NumberInputToggle;
