import React from 'react';
import PropTypes from 'prop-types';
import WithTooltip from './WithTooltip';
import { getChangeValue } from './Inputable';
import './toggle-switch.scss';

const propTypes = {
  value: PropTypes.bool.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  dataIdentifier: PropTypes.string,
};

export default class ToggleSwitch extends React.Component {
  handleChange = () => {
    this.props.onChange(getChangeValue(!this.props.value, this.props.name));
  };

  get slider() {
    return (
      <span className={`slider round ${this.props.disabled ? 'disabled' : ''}`} />
    );
  }

  render() {
    const { value, disabled, tooltip } = this.props;

    return (
      <label className="toggle-switch" data-identifier={this.props.dataIdentifier}>
        <input
          type="checkbox"
          checked={value}
          onChange={this.handleChange}
          disabled={disabled}
        />
        {!!tooltip
          ? <WithTooltip id="tooltip" placement="top" tooltip={tooltip}>
              {this.slider}
            </WithTooltip>
          : this.slider
        }
      </label>
    );
  }
}

ToggleSwitch.propTypes = propTypes;
