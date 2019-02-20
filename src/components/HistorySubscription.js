import React from 'react'
import PropTypes from 'prop-types';
import {getUrlSearchParams} from '../utils/dom-utils';

export default class HistorySubscription extends React.Component {
  static propTypes = {
    onMount: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onMount(getUrlSearchParams());
    window.addEventListener('popstate', this.handleHistoryChange);
  }

  handleHistoryChange = ev => {
    if (ev.state)  {
      this.props.onChange(getUrlSearchParams());
      return;
    }
    window.location.reload(true)
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistoryChange);
  }

  render() {
    return null;
  }
}
