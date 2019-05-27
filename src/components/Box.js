import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { generateInternalId, getChangeValue } from './Inputable';

class Box extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.bool,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    inline: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this._id = generateInternalId();
  }

  handleChange = () => {
    const { props } = this;
    if (props.disabled) {
      return;
    }
    props.onChange(getChangeValue(!props.value, props.name));
  };

  render() {
    const { props } = this;
    const inputableId = props.id || `${this._id}-inputable`;
    let wrapperClassName = 'form-check';
    if (props.inline) {
      wrapperClassName += ' form-check-inline'
    }
    return (
      <div className={wrapperClassName}>
        <input
          id={inputableId}
          type={props.type}
          className="form-check-input"
          checked={props.value}
          readOnly={!_.isNil(props.value)}
          onChange={this.handleChange}
          disabled={props.disabled}
        />
        <label htmlFor={inputableId} className="form-check-label">
          {props.label}
        </label>
      </div>
    );
  }
}

export const Checkbox = props => <Box {...props}  type="checkbox" />
export const Radio = props => <Box {...props} type="radio" />
