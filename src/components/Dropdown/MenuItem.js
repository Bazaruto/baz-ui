import React from 'react';
import PropTypes from 'prop-types';

export class MenuItem extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    focused: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    href: PropTypes.string,
    target: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  handleSelect = () => {
    this.props.onSelect && this.props.onSelect();
  };

  handleMouseEnter = () => {
    this.props.onMouseEnter(this.props.index);
  }

  setRef = ref => this.container = ref;

  render() {
    const { index, focused } = this.props;
    let className;
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
          ref={this.setRef}
          className={className}
          href={this.props.href}
          target={this.props.target}>
          {this.props.children}
        </a>
      </li>
    );
  }
}
