import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Inputable from './Inputable';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  radio: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
  note: PropTypes.string,
  showMessage: PropTypes.bool,
  message: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  labelClassName: PropTypes.string
};

const defaultProps = {
  style: {},
  className: 'form-control',
  labelClassName: 'listLabel control-label'
};

export class Box extends Component {
  handleChange = () => {
    if(this.props.disabled){
      return null;
    }
    this.props.onChange(!this.props.value);
  };

  get disabledClass(){
    if (this.props.disabled) {
      return 'not-allowed';
    }

    return '';
  }

  render() {
    const { value, radio, name, className, style, note, labelClassName } = this.props;
    return (
      <div>
        <input
          checked={!!value}
          type={radio ? 'radio' : 'checkbox'}
          readOnly
          disabled={this.props.disabled}
          {...{name, style, className}}
        />
        <label data-id={`${name}-box`} className={labelClassName} onClick={this.handleChange}>
          <span className={`check ${this.disabledClass}`}/><span>{note}</span>
        </label>
      </div>
    );
  }
}

Box.propTypes = propTypes;
Box.defaultProps = defaultProps;
export default Inputable(Box);
