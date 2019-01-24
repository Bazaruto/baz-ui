import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

export default class CheckboxList extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    checkedItems: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleCheck = (type, checked) => {
    const { name, checkedItems, onChange } = this.props;
    if (checked) {
      onChange({ [name]: checkedItems.concat(type) });
      return;
    }
    onChange({
      [name]: _.isObject(type) ? checkedItems.filter(t => t.id !== type.id) : checkedItems.filter(t => t !== type)
    })
  };

  isChecked = (item) => {
    if (_.isObject(item)) {
      return _.some(this.props.checkedItems, i => i.id === item.id);
    }
    return _.includes(this.props.checkedItems, item);
  };

  render() {
    return this.props.children({ isChecked: this.isChecked, onCheck: this.handleCheck });
  }
}
