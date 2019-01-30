import React from 'react';
import PropTypes from 'prop-types';
import inputable from './Inputable';
import _ from 'lodash';

const propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
};

const defaultProps = {
  value: '',
  className: 'form-control',
};

export class NumberInput extends React.Component {
  handleChange = event => {
    let newValue = event.target.value.replace(/\D/g, '');
    if (!newValue.length && this.props.clearable) {
      this.props.onChange(newValue);
      return;
    }
    if (this.props.value !== newValue) {
      newValue = _.isNaN(newValue) ? null : Number(newValue);
      this.props.onChange(newValue);
    }
  };

  render() {
    return (
      <input
        type="text"
        maxLength={this.props.maxLength}
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        disabled={this.props.disabled}
        name={this.props.name}
        placeholder={this.props.placeholder}
      />
    );
  }
}

const Inputable = inputable(NumberInput);
Inputable.propTypes = propTypes;
Inputable.defaultProps = defaultProps;
export default Inputable;
