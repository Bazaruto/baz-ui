import React, {Fragment} from 'react'
import {getUrlSearchParams} from '../utils/dom-utils';

export default class HistorySubscription extends React.Component {
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
