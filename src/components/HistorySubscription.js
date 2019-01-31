import React, {Fragment} from 'react'
import {getUrlParams} from '../utils/dom-utils';

export default class HistorySubscription extends React.Component {
  componentDidMount() {
    this.props.onMount(getUrlParams());
    window.addEventListener('popstate', this.handleHistoryChange);
  }

  handleHistoryChange = ev => {
    if (ev.state)  {
      this.props.onChange(ev.state);
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
