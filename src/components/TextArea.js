import inputable from './Inputable';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

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

function TextArea({ value, dataIdentifier, inputRef, ...rest }) {
  return (
    <textarea
      value={!!rest.onChange && _.isNil(value) ? '' : value}
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
