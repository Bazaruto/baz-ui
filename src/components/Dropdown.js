import React from 'react';
import './dropdown.scss';
import $ from 'jquery';

export const FocusContext = React.createContext({
  index: 0,
  updateIndex: () => {},
});

export default class Dropdown extends React.Component {
  static defaultProps = {
    onHide() {},
    align: 'bottom',
    startIndex: -1,
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      index: props.startIndex,
      updateIndex: this.handleMouseEnter
    };
  }

  isControlled() {
    return this.props.hasOwnProperty('show');
  }

  componentDidMount(prevProps) {
    if (this.props.show) {
      this.handleToggle();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.handleToggle();
    }
  }

  handleToggle = () => {
    if (this.state.show) {
      document.removeEventListener('mousedown', this.handleClickOutside);
    } else {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    this.setState({ show: !this.state.show, index: this.props.startIndex });
  }

  handleClickOutside = e => {
    if (!this.wrapperElem || this.wrapperElem.contains(e.target)) {
      return;
    }

    if (this.isControlled()) {
      this.props.onHide();
      return;
    }

    this.handleToggle();
  }

  handleMouseEnter = index => {
    // this.setState({ index })
  }

  menuItemRefs = [];

  render() {
    const arr =  React.Children.toArray(this.props.children);
    const toggle = arr[0];

    const additionalToggleProps = {
      ref: el => {
        this.toggleElem = el;
        toggle.ref && toggle.ref(el);
      },
      className: `${toggle.props.className || ''} ${this.state.show ? 'active' : ''}`,
      onKeyDown: ev => {
        // console.log(ev.which)
        // let newIndex;
        // switch (ev.which) {
        //   case 40:
        //     event.preventDefault();
        //     newIndex = Math.min(this.menuItemRefs.length, this.state.index + 1);
        //     this.setState({ index: newIndex })
        //     if (this.menuItemRefs[newIndex]) {
        //       // this.menuItemRefs[newIndex].anc.focus();
        //
        //       const rect = this.menuItemRefs[newIndex].anc.getBoundingClientRect();
        //       const menuRect = this.menuElem.getBoundingClientRect();
        //       const diff = rect.bottom - menuRect.bottom;
        //       console.log('diff', diff)
        //       if (diff > 0) {
        //         const $menu = $(this.menuElem);
        //         $menu.scrollTop(
        //           $menu.scrollTop() + $(this.menuItemRefs[newIndex].anc).position().top
        //         );
        //       }
        //       console.log('li rect', rect)
        //       console.log('menuRect', menuRect)
        //     }
        //     return;
        //   case 38:
        //     event.preventDefault();
        //     newIndex = Math.max(this.props.startIndex, this.state.index - 1)
        //     this.setState({ index: newIndex })
        //     return;
        //   case 13:
        //     if (this.menuItemRefs[this.state.index]) {
        //       this.menuItemRefs[this.state.index].handleClick();
        //       this.setState({ index: this.props.startIndex })
        //     }
        // }
      }
    };

    const additionalMenuProps = {
      menuRef: el => { this.menuElem = el },
      refs: this.menuItemRefs,
    };

    if (this.state.show) {
      additionalMenuProps.menuStyle = getPlacement(this.props.align, this.toggleElem, this.menuElem);
    }

    if (this.isControlled()) {
      additionalMenuProps.onClick = ev => {
        ev.stopPropagation();
        // this.props.onHide();
      }
    } else {
      additionalToggleProps.onClick = this.handleToggle;
      additionalMenuProps.onClick = this.handleToggle;
    }
    const Toggle = React.cloneElement(toggle, additionalToggleProps);
    const Menu = React.cloneElement(arr[1], additionalMenuProps);

    return (
      <div
        className={`lookahead-container ${this.state.show ? 'opened' : ''}`}
        ref={el => { this.wrapperElem = el; }}>
        {Toggle}
        <FocusContext.Provider value={this.state}>
          {Menu}
        </FocusContext.Provider>
      </div>
    );
  }
}

export class Menu extends React.Component {
  render() {
    const arr =  React.Children.toArray(this.props.children);
    return (
      <ul
        ref={this.props.menuRef}
        style={this.props.menuStyle}
        onClick={this.props.onClick}>
        {this.props.children}
      </ul>
    );
  }
}

export class MenuItem extends React.Component {
  handleClick = ev => {
    this.props.onClick && this.props.onClick(ev);
  };

  handleMouseEnter = () => {
    this.context.updateIndex(this.props.index);
  }

  render() {
    let className = '';
    if (this.props.selected || this.context.index === this.props.index) {
      className = 'menu-item-selected';
    }
    return (
      <li onClick={this.handleClick} onMouseEnter={this.handleMouseEnter}>
        <a ref={anc => { this.anc = anc }} className={className} href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </li>
    );
  }
}

MenuItem.contextType = FocusContext;

function getPlacement(placement, toggleElem, menuElem) {
  const toggleRect = toggleElem.getBoundingClientRect();
  const menuRect = menuElem.getBoundingClientRect();
  const x1 = toggleRect.width, y1 = toggleRect.height, x2 = menuRect.width, y2 = menuRect.height;
  switch (placement) {
    case 'bottom':
      return {
        left: (x1 - x2) / 2
      };
    case 'left':
      return {
        left: -x2,
        top: (y1 - y2) / 2
      };
    case 'right':
      return {
        left: x1,
        top: (y1 - y2) / 2
      }
  }
}

