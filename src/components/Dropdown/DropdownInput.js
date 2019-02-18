import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

const propTypes = {
  // Internal props
  namespace: PropTypes.string,
  refs: PropTypes.object,
  expanded: PropTypes.bool,
  focusedIndex: PropTypes.number,
  onToggle: PropTypes.func,
  // External props
  onFocus: PropTypes.func,
};

const defaultProps = {
  refs: {},
  expanded: false,
  focusedIndex: -1,
  onToggle() {}
};

export const DropdownInput = React.forwardRef(({namespace, refs, expanded, focusedIndex, onToggle, ...props}, ref) => {
  const listboxId =`${namespace}-menu-listbox`;
  return (
    <div
      id={`${namespace}-input-combobox`}
      role="combobox"
      aria-expanded={expanded}
      aria-owns={listboxId}
      aria-haspopup="listbox">
      <Input
        {...props}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={focusedIndex > -1 ? `result-${focusedIndex}` : null}
        autoComplete="off"
        inputRef={input => {
          ref && ref(input);
          refs.toggle = input;
        }}
        onFocus={ev => {
          refs.toggle.focus();
          props.onFocus && props.onFocus(ev);
          onToggle();
        }}
      />
    </div>
  );
});

DropdownInput.propTypes = propTypes;
DropdownInput.defaultProps = defaultProps;
DropdownInput.displayName = 'DropdownInput';

