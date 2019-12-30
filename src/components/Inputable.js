import React from 'react';
import { generateId } from './utils';

export default function inputable(Wrapped) {
  const displayName = getDisplayName(Wrapped);

  class Inputable extends React.Component {
    constructor(props) {
      super(props);
      this._id = generateId();
    }

    handleChange = eventOrUpdate => {
      let change = isEvent(eventOrUpdate) ? eventOrUpdate.target.value : eventOrUpdate;
      const { onChange, name, index } = this.props;
      change = getChangeValue(change, name); // Conditionally convert to object with name as key
      if (index === undefined) {
        onChange(change);
        return;
      }
      onChange(change, index);
    };

    focus() {
      if (this.wrapped && this.wrapped.focus) {
        this.wrapped.focus();
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`Unable to focus(). Use inputRef callback prop in ${displayName}. See <Input /> as an example`);
      }
    }

    setInputRef = wrapped => {
      this.wrapped = wrapped;
      const { inputRef } = this.props;
      if (inputRef) {
        inputRef(wrapped);
      }
    };

    render() {
      const { label, message, required, showMessage, button, prepend, append, panel, infoSection, ...rest } = this.props;
      const controlledInput = !!this.props.onChange;

      const inputableId = this.props.id || this._id;
      const messageToShow = showMessage && message;
      const groupClassName = 'form-group' + (messageToShow ? ' has-error' : '');

      return (
        <div className={groupClassName}>
          {label && (
            <label className="control-label col-form-label" htmlFor={inputableId}>
              {label}
              {required && <span className="required-asterisk"> *</span>}
            </label>
          )}
          <div className={'relative' + (button || prepend || append ? ' input-group' : '')}>
            {prepend && (
              <span className="input-group-addon input-group-prepend">
                {prepend}
              </span>
            )}
            <Wrapped
              {...rest}
              id={inputableId}
              onChange={controlledInput ? this.handleChange : undefined}
              inputRef={this.setInputRef}
            />
            {append && (
              <span className="input-group-addon input-group-append">
                {append}
              </span>
            )}
            {button && (
              <span className="input-group-btn input-group-append">
                {button}
              </span>
            )}
            {panel && (
              <span className="inputable-panel">
                {panel}
              </span>
            )}
          </div>
          {messageToShow && <small className="control-label form-text">{messageToShow}</small>}
          {infoSection}
        </div>
      );
    }
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
