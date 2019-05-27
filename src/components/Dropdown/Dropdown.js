import React from 'react';
import PropTypes from 'prop-types';
import { Subject, fromEvent } from 'rxjs';
import { filter, throttleTime, tap } from 'rxjs/operators';
import { trailingThrottle } from '../../epics/custom-operators';
import { KEYS, isDownArrow, isUpArrow, handleArrowKey, generateId } from './utils';

/**
 * @see {@link https://w3c.github.io/aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html} for the spec
 */
export class Dropdown extends React.Component {
  static propTypes = {
    onHide: PropTypes.func,
    autoSelect: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    onHide() {},
    autoSelect: true
  };

  constructor(props) {
    super(props);
    const initialIndex = this.getInitialIndex();
    this.state = {
      show: false,
      keyboardFocusIndex: initialIndex,
      mouseHoverIndex: initialIndex,
      blockMouseEnters: false,
    };

    this.uiRefs = {
      container: null,
      menu: null,
      toggle: null,
      menuItems: [],
    };

    this.namespace = generateId('dropdown');
  }

  componentDidMount() {
    const keyDowns = fromEvent(this.uiRefs.toggle, 'keydown');
    const mouseMoves = fromEvent(this.uiRefs.menu, 'mousemove');
    const mouseLeaves = fromEvent(this.uiRefs.menu, 'mouseleave');
    this.menuItemMouseEnters = new Subject();

    this.subscriptions = [
      keyDowns
        .pipe(
          filter(ev => isDownArrow(ev) || isUpArrow(ev)),
          tap(ev => ev.preventDefault()),
          throttleTime(40)
        )
        .subscribe(ev => {
          handleArrowKey(
            ev,
            this.uiRefs,
            this.getActiveIndex(),
            newIndex => this.setState(keyboardMovedTo(newIndex))
          );
        }),

      keyDowns.subscribe(ev => {
        switch (ev.which) {
          case KEYS.ENTER: {
            ev.preventDefault();
            const menuItemRef = this.uiRefs.menuItems[this.getActiveIndex()];
            if (menuItemRef) {
              menuItemRef.handleSelect();
              this.handleToggle();
            } else {
              this.setState(resetIndices())
            }
            break;
          }
          case KEYS.ESC:
            ev.stopPropagation();
            this.uiRefs.toggle.focus();
            /* falls through */
          case KEYS.TAB:
            if (this.state.show) {
              this.handleToggle();
              this.props.onHide();
            }
            break;
          default:
            if (!this.state.show) {
              this.handleToggle();
            }
            break;
        }
      }),

      mouseMoves
        .pipe(throttleTime(100))
        .subscribe(() => {
          if (this.state.blockMouseEnters) {
            this.setState({ blockMouseEnters: false });
          }
        }),

      this.menuItemMouseEnters
        .pipe(trailingThrottle(40))
        .subscribe(mouseHoverIndex => {
          if (this.state.blockMouseEnters) {
            return;
          }
          this.setState(mouseHoveredAt(mouseHoverIndex));
        }),

      mouseLeaves.subscribe(() => {
        this.setState(resetIndices())
      })
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleMouseEnter = mouseHoverIndex => this.menuItemMouseEnters.next(mouseHoverIndex);

  getInitialIndex() {
    return this.props.autoSelect ? 0 : -1;
  }

  getActiveIndex() {
    return Math.max(this.state.mouseHoverIndex, this.state.keyboardFocusIndex);
  }

  handleToggle = () => {
    if (this.state.show) {
      this.uiRefs.menuItems = [];
      document.removeEventListener('mousedown', this.handleClickOutside);
    } else {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    this.setState(toggleExpanded(this.getInitialIndex()));
  }

  handleClickOutside = e => {
    if (!this.uiRefs.container || this.uiRefs.container.contains(e.target)) {
      return;
    }
    this.handleToggle();
    this.props.onHide();
  }

  registerMenuItemRef = (index, ref) => {
    if (index === 0) {
      this.uiRefs.menuItems = [];
    }
    this.uiRefs.menuItems[index] = ref;
  }

  render() {
    const { keyboardFocusIndex } = this.state;
    const additionalToggleProps = {
      refs: this.uiRefs,
      namespace: this.namespace,
      expanded: this.state.show,
      focusedIndex: keyboardFocusIndex,
      onToggle: this.handleToggle,
    };
    const additionalMenuProps = {
      refs: this.uiRefs,
      namespace: this.namespace,
      expanded: this.state.show,
      focusedIndex: keyboardFocusIndex,
      registerMenuItem: this.registerMenuItemRef,
      onMouseEnter: this.handleMouseEnter,
      onClick: ev => {
        ev.stopPropagation();
        this.handleToggle();
      }
    };

    const childrenArray = React.Children.toArray(this.props.children);
    const Toggle = React.cloneElement(childrenArray[0], additionalToggleProps);
    const Menu = React.cloneElement(childrenArray[1], additionalMenuProps);

    return (
      <div
        data-dropdown-container
        ref={ref => { this.uiRefs.container = ref }}
        className={`${this.state.show ? 'dd-expanded' : ''}${keyboardFocusIndex > -1 ? ' keyboard-controlled' : ''}`}>
        {Toggle}
        {Menu}
      </div>
    );
  }
}

// State change handlers
function toggleExpanded(initialIndex) {
  return state => {
    return {
      show: !state.show,
      mouseHoverIndex: initialIndex,
      keyboardFocusIndex: initialIndex,
    }
  }
}

function keyboardMovedTo(newIndex) {
  return {
    keyboardFocusIndex: newIndex,
    mouseHoverIndex: -1,
    blockMouseEnters: true,
  };
}

function mouseHoveredAt(newIndex) {
  return state => {
    const newState = { mouseHoverIndex: newIndex };
    if (state.keyboardFocusIndex > -1) {
      newState.keyboardFocusIndex = - 1;
    }
    return newState;
  }
}

function resetIndices() {
  return {
    keyboardFocusIndex: - 1,
    mouseHoverIndex: -1,
  }
}
