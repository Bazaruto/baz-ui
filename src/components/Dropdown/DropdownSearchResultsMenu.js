import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from './MenuItem';
import {EMPTY_ARRAY} from '../../constants';

export class DropdownSearchResultsMenu extends React.Component {
  static propTypes = {
    // Internal props
    refs: PropTypes.object,
    namespace: PropTypes.string,
    expanded: PropTypes.bool,
    focusedIndex: PropTypes.number,
    registerMenuItem: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onClick: PropTypes.func,
    // External props
    results: PropTypes.array.isRequired,
    renderResult: PropTypes.func.isRequired,
    renderEmptyState: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    menuStyle: PropTypes.object,
  };

  static defaultProps = {
    refs: {},
    registerMenuItem() {},
    onMouseEnter() {},
    onClick() {}
  };

  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results && this.props.results.length > 0) {
      this.menu.scrollTop = 0;
    }
  }

  render() {
    return (
      <ul
        id={`${this.props.namespace}-menu-listbox`}
        role="listbox"
        ref={ref => {
          this.menu = ref;
          this.props.refs.menu = ref;
        }}
        style={this.props.menuStyle}
        onClick={this.props.onClick}>
        {!this.props.results.length && this.props.renderEmptyState()}
        <SearchResults
          registerMenuItem={this.props.registerMenuItem}
          results={this.props.expanded && this.props.results || EMPTY_ARRAY}
          isSelected={this.props.isSelected}
          focusedIndex={this.props.focusedIndex}
          onMouseEnter={this.props.onMouseEnter}
          onSelect={this.props.onSelect}
          renderResult={this.props.renderResult}
        />
      </ul>
    );
  }
}

class SearchResults extends React.PureComponent {
  static propTypes = {
    focusedIndex: PropTypes.number.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    registerMenuItem: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired,
    renderResult: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  render() {
    const { props } = this;
    return props.results.map((sug, i) =>
      <MenuItem
        key={i}
        ref={ref => {
          this.props.registerMenuItem(i, ref);
        }}
        index={i}
        focused={i === props.focusedIndex}
        selected={props.isSelected(sug)}
        onMouseEnter={props.onMouseEnter}
        onSelect={() => props.onSelect(sug)}>
        {props.renderResult(sug)}
      </MenuItem>
    );
  }
}
