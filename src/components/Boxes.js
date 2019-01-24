import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Box } from './Box';
import Inputable from './Inputable';

const propTypes = {
  radio: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
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
  rowClassName: PropTypes.string,
  rowStyle: PropTypes.object,
};

const defaultProps = {
  className: 'margin-top'
};

const Boxes = props => (
  <div className={props.className} style={{width: '100%', display: 'inline-block'}}>
    {props.options.map(option => (
      <div className={props.rowClassName} style={props.rowStyle} key={option.value}>
        <Box
          radio={props.radio}
          value={option.value === props.value}
          onChange={() => props.onChange(option.value)}
          note={option.label}
        />
      </div>
    ))}
  </div>
);

Boxes.propTypes = propTypes;
Boxes.defaultProps = defaultProps;
export default Inputable(Boxes);

