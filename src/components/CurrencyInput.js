import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import Inputable from './Inputable';
import { formatNumber, breakIntoAmounts } from '../utils/number-utils';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
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
};

const defaultProps = {
  value: '',
  className: 'form-control',
};

class CurrencyInput extends Component {
  componentDidMount() {
    const { value } = this.props;
    this.updateCurrencyInput(value, numberOfDecimalsToFormat(value));
  }

  componentDidUpdate() {
    const { value } = this.props;
    if (this.roundedValue === value) {
      return;
    }
    this.updateCurrencyInput(value, numberOfDecimalsToFormat(value));
  }

  handleChange = event => {
    const newText = event.target.value.replace(/\s/g, '');
    this.updateCurrencyInput(newText);
    this.triggerChange();
  };

  handleBlur = () => {
    const currentText = this.input.value || 0;
    this.updateCurrencyInput(currentText, numberOfDecimalsToFormat(currentText));
    this.triggerChange();
  };

  triggerChange() {
    const { onChange, value } = this.props;
    if (!onChange || value === this.roundedValue) {
      return;
    }
    onChange(this.roundedValue);
  }

  updateCurrencyInput(valueToFormat, decimals) {
    // Handle when a nil value is passed in, otherwise ensure it's a string
    valueToFormat = _.isNil(valueToFormat) ? '' : valueToFormat + '';

    const sign = valueToFormat.startsWith('-') ? '-' : '';
    const [ integerAmount, decimalAmount ] = breakIntoAmounts(valueToFormat);
    const fullAmountText = `${integerAmount}.${decimalAmount}`;
    // The actual amount which the formatted value evaluates to.
    // Used when firing on change events and when comparing on component update
    this.roundedValue = _.isEmpty(valueToFormat) ? 0 : _.round(`${sign}0${fullAmountText}`, 2);

    decimals = decimals === undefined ? decimalAmount.length : decimals;
    let formattedValue = sign + formatNumber(parseFloat(fullAmountText), decimals);

    // Add trailing decimal point back in to formattedValue
    if (hasTrailingDecimalPoint(valueToFormat) && !decimalAmount.length) {
      formattedValue = `${formattedValue}.`;
    }

    let start = this.input.selectionStart;
    this.input.value = formattedValue;

    // Take care of ranges if the input is focused
    if (document.activeElement === this.input) {
      if (valueToFormat.length < formattedValue.length) {
        start++;
      } else if (valueToFormat.length > formattedValue.length) {
        start--;
      }
      this.input.setSelectionRange(start, start);
    }
  }

  handleRef = ref => {
    this.input = ref;
    const { inputRef } = this.props;
    if (inputRef) {
      inputRef(ref);
    }
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataIdentifier, value, inputRef, ...rest } = this.props;
    return (
      <input
        data-identifier={dataIdentifier}
        {...rest}
        type="text"
        ref={this.handleRef}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

CurrencyInput.propTypes = propTypes;
CurrencyInput.defaultProps = defaultProps;
export default Inputable(CurrencyInput);

function numberOfDecimalsToFormat(value) {
  // Format zeros without decimals
  return parseFloat(value) === 0 ? 0 : 2;
}

function hasTrailingDecimalPoint(valueToFormat) {
  return valueToFormat.length && valueToFormat.indexOf('.') === valueToFormat.length - 1;
}

