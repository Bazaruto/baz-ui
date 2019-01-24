import inputable from './Inputable';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

const propTypes = {
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
  onBlur: () => {},
  placeholder: '',
};

function TextArea({ controlled, value, dataIdentifier, inputRef, ...rest }) {
  return (
    <textarea
      type="text"
      value={controlled && _.isNil(value) ? '' : value}
      data-identifier={dataIdentifier}
      ref={inputRef}
      {...rest}
    />
  );
}

const Inputable = inputable(TextArea);
Inputable.propTypes = propTypes;
Inputable.defaultProps = defaultProps;
export default Inputable;
