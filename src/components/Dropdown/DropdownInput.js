import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  // Internal props
  namespace: PropTypes.string,
  refs: PropTypes.object,
  expanded: PropTypes.bool,
  focusedIndex: PropTypes.number,
  onToggle: PropTypes.func,
  // External props
  onFocus: PropTypes.func,
  buttonPanel: PropTypes.node,
};

const defaultProps = {
  refs: {},
  expanded: false,
  focusedIndex: -1,
  onToggle() {}
};

export const DropdownInput = React.forwardRef(({namespace, refs, expanded, focusedIndex, onToggle, buttonPanel, ...props}, ref) => {
  const listboxId =`${namespace}-menu-listbox`;
  return (
    <div
      id={`${namespace}-input-combobox`}
      role="combobox"
      aria-expanded={expanded}
      aria-owns={listboxId}
      aria-haspopup="listbox"
      className="relative"
    >
      <input
        {...props}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={expanded && focusedIndex > -1 ? `result-${focusedIndex}` : null}
        autoComplete="off"
        ref={input => {
          ref && ref(input);
          refs.toggle = input;
        }}
        onFocus={ev => {
          props.onFocus && props.onFocus(ev);
          !expanded && onToggle();
        }}
      />
      <span className="inputable-panel">
        {buttonPanel}
      </span>
    </div>
  );
});

DropdownInput.propTypes = propTypes;
DropdownInput.defaultProps = defaultProps;
DropdownInput.displayName = 'DropdownInput';

