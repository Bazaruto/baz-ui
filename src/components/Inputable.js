import React from 'react';
import { useId } from './utils';

export default function makeInputable(Wrapped) {
  const displayName = getDisplayName(Wrapped);

  function Inputable(props) {
    const handleChange = eventOrUpdate => {
      let change = isEvent(eventOrUpdate) ? eventOrUpdate.target.value : eventOrUpdate;
      const { onChange, name } = props;
      change = getChangeValue(change, name); // Conditionally convert to object with name as key
      onChange(change);
    };

    const {
      label,
      inputRef,
      message,
      required,
      showMessage,
      button,
      prepend,
      append,
      panel,
      ...rest
    } = props;

    const autoId = useId();
    const controlId = props.id || autoId;
    const messageId = useId();
    const messageToShow = showMessage && message;
    const groupClassName = 'form-group' + (messageToShow ? ' has-error' : '');

    return (
      <div className={groupClassName}>
        {label && (
          <label className="control-label" htmlFor={controlId}>
            {label}
            {required && <span className="required-asterisk"> *</span>}
          </label>
        )}
        <div className={'relative' + (button || prepend || append ? ' input-group' : '')}>
          {prepend && (
            <span className="input-group-prepend">
              <span className="input-group-text">{prepend}</span>
            </span>
          )}
          <Wrapped
            {...rest}
            id={controlId}
            required={required}
            aria-errormessage={messageId}
            aria-invalid={!!messageToShow}
            onChange={props.onChange ? handleChange : undefined}
            inputRef={el => {
              if (inputRef) {
                inputRef(el);
              }
            }}
          />
          {append && (
            <div className="input-group-append">
              <span className="input-group-text">{append}</span>
            </div>
          )}
          {button && <span className="input-group-append">{button}</span>}
          {panel && <span className="inputable-panel">{panel}</span>}
        </div>
        <small
          id={messageId}
          aria-live={messageToShow ? 'polite' : 'off'}
          style={{ visibility: messageToShow ? 'visible' : 'hidden' }}
          className="block error-red-text form-text"
        >
          {messageToShow}
        </small>
      </div>
    );
  }
  Inputable.displayName = `Inputable(${displayName})`;
  return Inputable;
}

export function getChangeValue(value, name) {
  return name ? { [name]: value } : value;
}

function getDisplayName(Wrapped) {
  return Wrapped.displayName || Wrapped.name || (typeof Wrapped === 'string' ? Wrapped : 'Unknown');
}

function isEvent(eventOrUpdate) {
  return !!eventOrUpdate && !!eventOrUpdate.target && eventOrUpdate.target.hasOwnProperty('value');
}
