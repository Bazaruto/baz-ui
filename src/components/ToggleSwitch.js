import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { getChangeValue } from './Inputable';
import { useId } from './utils';

ToggleSwitch.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  'aria-label': PropTypes.string,
  value: PropTypes.bool.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  tooltip: PropTypes.node,
  dataIdentifier: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

ToggleSwitch.defaultProps = {
  size: 'medium',
};

export default function ToggleSwitch(props) {
  const internalId = useId();
  const id = props.id || internalId;
  const inputRef = useRef();
  let containerClassName = 'toggle-switch';
  if (props.size) {
    containerClassName += ` toggle-switch--${props.size}`;
  }
  return (
    <div className={containerClassName}>
      <input
        id={id}
        ref={inputRef}
        type="checkbox"
        name={props.name}
        className="toggle-switch-input"
        checked={props.value}
        onChange={() => {
          props.onChange(getChangeValue(!props.value, props.name));
        }}
        disabled={props.disabled}
        aria-label={props['aria-label']}
        data-identifier={props.dataIdentifier}
      />
      {props.label ? (
        <label htmlFor={id} className="toggle-switch-label">
          {props.label}
        </label>
      ) : (
        <span
          className="toggle-switch-label"
          onClick={(ev) => {
            if (props.disabled) return;
            ev.preventDefault();
            ev.stopPropagation();
            inputRef.current.focus();
            inputRef.current.click();
          }}
        />
      )}
    </div>
  );
}
