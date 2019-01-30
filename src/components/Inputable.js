import React from 'react';

export default function inputable(Wrapped) {
  const displayName = getDisplayName(Wrapped);

  class Inputable extends React.Component {
    handleChange = change => {
      if (change && change.target && change.target.value !== undefined) {
        change = change.target.value;
      }
      this.props.onChange(getChangeValue(change, this.props.name));
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
      const { label, message, required, showMessage, button, panel, ...rest } = this.props;
      const controlledInput = !!this.props.onChange;

      const messageToShow = showMessage && message;
      const groupClassName = 'form-group' + (messageToShow ? ' has-error' : '');

      return (
        <div className={groupClassName}>
          {label &&
            <label className="control-label">
              {label}
              {required && <span className="required-asterisk"> *</span>}
            </label>
          }
          <div className={'relative' + (button ? ' input-group' : '')}>
            <Wrapped
              {...rest}
              onChange={controlledInput ? this.handleChange : undefined}
              controlled={controlledInput}
              inputRef={this.setInputRef}
            />
            {button &&
              <span className="input-group-btn input-group-append">
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
