import React from 'react';
import NumberTextInput from '../NumberTextInput';
import Inputable from './Inputable';

const defaultProps = {
  className: 'form-control'
};

const NumberInput = Inputable(NumberTextInput);
NumberInput.defaultProps = defaultProps;
export default NumberInput;
