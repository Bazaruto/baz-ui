import PropTypes from 'prop-types';
import React from 'react';
import ReactSelect from 'react-select';
import _ from 'lodash';
import { getChangeValue } from './Inputable'

ReactSelect.displayName = 'ReactSelect';

const propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  showMessage: PropTypes.bool,
  message: PropTypes.string,
  multi: PropTypes.bool,
  placeholder: PropTypes.string,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  disabled: PropTypes.bool,
  valueKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  dataIdentifier: PropTypes.string,
  selectClassName: PropTypes.string,
  pluckValueOnChange: PropTypes.bool,
  required: PropTypes.bool,
};

const defaultProps = {
  value: undefined,
  clearable: false,
  searchable: false,
  disabled: false,
  valueKey: 'value',
  labelKey: 'label',
  theme: 'light-theme',
  selectClassName: '',
  pluckValueOnChange: true
};

class Select extends React.Component {
  handleChange = change => {
    if (!change && !this.props.clearable) {
      return;
    }
    if (!this.props.pluckValueOnChange) {
      return this.props.onChange(change);
    }
    const value = change ? change[this.props.valueKey] : change;
    this.props.onChange(getChangeValue(value, this.props.name));
  };

  get value() {
    if (Array.isArray(this.props.value)) {
      return this.props.value.filter(item => !_.isEmpty(item));
    }
    return this.props.value;
  }

  get messageToShow() {
    return this.props.showMessage && this.props.message;
  }

  get divClassName() {
    return this.props.theme + ' form-group' + (this.messageToShow ? ' has-error' : '');
  }

  render() {
    const { label, name, options, multi, clearable, message, disabled, valueKey, labelKey, placeholder, dataIdentifier, selectClassName } = this.props;
    return (
      <div
        data-identifier={dataIdentifier || name}
        className={this.divClassName}
      >
        {label && <label className="control-label">{label}</label>}
        {this.props.required && <span className="required-asterisk"> *</span>}
        <ReactSelect
          className={selectClassName}
          value={this.value}
          onChange={this.handleChange}
          searchable={this.props.searchable}
          onBlur={this.props.onBlur}
          {...{options, clearable, multi, name, disabled, valueKey, labelKey, placeholder}}
        />
        {this.messageToShow && <label className="control-label">{message}</label>}
        {this.props.children}
      </div>
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;
export default Select;
