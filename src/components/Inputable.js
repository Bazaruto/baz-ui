import React from 'react';

export default function inputable(Wrapped) {
  const displayName = getDisplayName(Wrapped);

  class Inputable extends React.Component {
    constructor(props) {
      super(props);
      this._id = generateInternalId();
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
      const { id, label, message, required, showMessage, button, panel, infoSection, ...rest } = this.props;
      const controlledInput = !!this.props.onChange;

      const inputableId = id || `${this._id}-inputable`;
      const messageToShow = showMessage && message;
      const groupClassName = 'form-group' + (messageToShow ? ' has-error' : '');

      return (
        <div className={groupClassName}>
          {label &&
          <label className="control-label" htmlFor={inputableId}>
            {label}
            {required && <span className="required-asterisk"> *</span>}
          </label>
          }
          <div className={'relative' + (button ? ' input-group' : '')}>
            <Wrapped
              {...rest}
              id={inputableId}
              onChange={controlledInput ? this.handleChange : undefined}
              controlled={controlledInput}
              inputRef={this.setInputRef}
            />
            {button &&
            <span className="input-group-btn">
                {button}
              </span>
            }
            {panel &&
            <span className="inputable-panel">
                {panel}
              </span>
            }
          </div>
          {messageToShow && <label className="control-label">{messageToShow}</label>}
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

let counter = 0;
export function generateInternalId() {
  return ++counter;
}
