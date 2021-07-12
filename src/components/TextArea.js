import inputable from './Inputable';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  name: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  showMessage: PropTypes.bool,
  message: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  style: { maxWidth: '100%' },
  className: 'form-control',
};

function TextArea({ inputRef, ...rest }) {
  return (
    <textarea
      ref={inputRef}
      {...rest}
    />
  );
}

const Inputable = inputable(TextArea);
Inputable.propTypes = propTypes;
Inputable.defaultProps = defaultProps;
export default Inputable;
