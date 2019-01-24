import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isEmail } from '../validation';
import Input from '../form/Input';

export default class EmailInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onValidEmailChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.debouncedSearch = _.debounce(props.onValidEmailChange, 500);
  }

  handleChange = newState => {
    this.props.onChange(newState);
    if (!_.isEmpty(newState.email) && isEmail(newState.email)) {
      this.debouncedSearch(newState.email);
    }
  }

  render() {
    const props = _.omit(this.props, 'onValidEmailChange');

    return (
      <Input {...props} onChange={this.handleChange} />
    );
  }
}
