import React from 'react';
import PropTypes from 'prop-types';
import { Subject, fromEvent } from 'rxjs';
import { filter, throttleTime, tap } from 'rxjs/operators';
import { FocusContext } from './FocusContext';
import { KEYS, isDownArrow, isUpArrow, handleArrowKey, generateId } from './utils';
import './dropdown.scss';

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
    const startIndex = this.getStartIndex();
    this.state = {
      show: false,
      keyboardFocusIndex: startIndex,
      updateHoverIndex: this.handleMouseEnter,
    };

    this.mouseHoverIndex = startIndex;
    this.blockMouseEnters = false;
    this.uiRefs = {
      container: null,
      menu: null,
      toggle: null,
      menuItems: [],
    };
    this.namespace = generateId('dropdown');
  }

  getStartIndex() {
    return this.props.autoSelect ? 0 : -1;
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
          this.blockMouseEnters = true;
          handleArrowKey(
            ev,
            this.uiRefs,
            this.mouseHoverIndex,
            newIndex => {
              this.mouseHoverIndex = newIndex;
              this.setState({ keyboardFocusIndex: newIndex });
            }
          );
        }),

      keyDowns.subscribe(ev => {
        switch (ev.which) {
          case KEYS.ENTER: {
            ev.preventDefault();
            const menuItemRef = this.uiRefs.menuItems[this.mouseHoverIndex];
            if (menuItemRef) {
              menuItemRef.handleSelect();
              this.handleToggle();
            }
            this.uiRefs.menu.scrollTop = 0;
            this.setState({ keyboardFocusIndex: -1 })
            this.mouseHoverIndex = -1;
            break;
          }
          case KEYS.ESC:
            ev.stopPropagation();
            this.uiRefs.toggle.focus();
            /* falls through */
          case KEYS.TAB:
            this.uiRefs.menu.scrollTop = 0;
            this.setState({ keyboardFocusIndex: -1 })
            this.mouseHoverIndex = -1;
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

      mouseMoves.subscribe(() => {
        this.blockMouseEnters = false;
      }),

      this.menuItemMouseEnters.subscribe(mouseHoverIndex => {
        if (this.blockMouseEnters) {
          return;
        }
        this.mouseHoverIndex = mouseHoverIndex;
        if (this.state.keyboardFocusIndex > -1) {
          this.setState({ keyboardFocusIndex: -1 });
        }
      }),

      mouseLeaves.subscribe(() => {
        this.mouseHoverIndex = -1;
        this.setState({ keyboardFocusIndex: -1 })
      })
    ];
  }

  handleMouseEnter = mouseHoverIndex => this.menuItemMouseEnters.next(mouseHoverIndex);

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleToggle = () => {
    if (this.state.show) {
      document.removeEventListener('mousedown', this.handleClickOutside);
    } else {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    const startIndex = this.getStartIndex();
    this.mouseHoverIndex = startIndex;
    this.setState({
      show: !this.state.show,
      keyboardFocusIndex: startIndex
    });
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
    const additionalToggleProps = {
      namespace: this.namespace,
      refs: this.uiRefs,
      expanded: this.state.show,
      focusedIndex: this.state.keyboardFocusIndex,
      onToggle: this.handleToggle,
    };
    const additionalMenuProps = {
      namespace: this.namespace,
      refs: this.uiRefs,
      registerMenuItem: this.registerMenuItemRef,
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
        className={`${this.state.show ? ' opened' : ''}${this.state.keyboardFocusIndex > -1 ? ' keyboard-controlled' : ''}`}
        ref={el => { this.uiRefs.container = el; }}>
        {Toggle}
        <FocusContext.Provider value={this.state}>
          {Menu}
        </FocusContext.Provider>
      </div>
    );
  }
}
