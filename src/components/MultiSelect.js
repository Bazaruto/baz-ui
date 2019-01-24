import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import Select from './Select';
import Tag from '../Tag';
import { getChangeValue } from './Inputable';

function isNone(values) {
  return values && values.length === 1 && values[0] === '';
}

const propTypes = {
  // Can be null
  values: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  name: PropTypes.string,
  message: PropTypes.string,
  showMessage: PropTypes.bool,
  includeNone: PropTypes.bool,
  dataIdentifier: PropTypes.string,
  searchable: PropTypes.bool,
};

const defaultProps = {
  searchable: false,
}

export default class MultiSelect extends Component {
  constructor(props) {
    super(props);

    this.options = props.includeNone
      ? [{ value: 'None', label: 'None' }].concat(props.options)
      : props.options;
  }

  handleChange = val => {
    const { values } = this.props;
    const newValues = val === 'None'
      // 'None' entry kept as empty string to combat Rails empty array issue
      ? ['']
      // Get rid of 'None' entry and add new value
      : _.uniq((values && values.filter(v => !!v) || []).concat(val));
    this.props.onChange(getChangeValue(newValues, this.props.name));
  };

  handleRemove = val => {
    let newValues = this.props.values.filter(v => v !== val);
    // Removing last entry sets field back to null
    newValues = newValues.length ? newValues : null;
    this.props.onChange(getChangeValue(newValues, this.props.name));
  };

  render() {
    const { values, message, showMessage, dataIdentifier } = this.props;
    return (
      <Select
        value={isNone(values) ? 'None' : undefined}
        onChange={this.handleChange}
        options={this.options}
        {...{message, showMessage, dataIdentifier }}
        searchable={this.props.searchable}
      >
        <div className="margin-top">
          {_.map(values, (val, index) =>
            val ? (
              <Tag
                label={val}
                value={val}
                onRemove={this.handleRemove}
                key={index}
              />
            ) : null
          )}
        </div>
      </Select>
    );
  }
}

MultiSelect.propTypes = propTypes;
MultiSelect.defaultProps = defaultProps;
