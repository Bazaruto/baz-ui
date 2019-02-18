import React from 'react';
import PropTypes from 'prop-types';
import { FocusContext } from './FocusContext';

export class MenuItem extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    href: PropTypes.string,
    target: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  handleSelect = () => {
    this.props.onSelect && this.props.onSelect();
  };

  handleMouseEnter = () => {
    this.context.updateHoverIndex(this.props.index);
  }

  render() {
    const { index } = this.props;
    let className = '';
    const focused = this.context.keyboardFocusIndex === index;
    if (focused) {
      className = 'menu-item-focused';
    } else if (this.props.selected) {
      className = 'menu-item-selected';
    }
    return (
      <li onClick={this.handleSelect} onMouseEnter={this.handleMouseEnter}>
        <a
          id={`result-${index}`}
          role="option"
          aria-selected={focused}
          ref={ref => {
            this.container = ref;
          }}
          className={className}
          href={this.props.href}
          target={this.props.target}>
          {this.props.children}
        </a>
      </li>
    );
  }
}

MenuItem.contextType = FocusContext;
