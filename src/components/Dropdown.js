import React from 'react';
import PropTypes from 'prop-types';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, filter, throttleTime, tap } from 'rxjs/operators';
import Input from './Input';
import './dropdown.scss';

const KEYS = {
  DOWN: 40,
  UP: 38,
  ENTER: 13,
  ESC: 27,
  TAB: 9,
}

// TODO Extract all the things
export const FocusContext = React.createContext({
  index: 0,
  updateIndex: () => {},
});

// https://w3c.github.io/aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
export default class Dropdown extends React.Component {
  static defaultProps = {
    onHide() {},
    onKeyboardSelect() {},
    align: 'bottom',
    autoSelect: true
  }

  constructor(props) {
    super(props);
    const startIndex = this.getStartIndex();
    this.state = {
      show: false,
      index: startIndex,
      updateIndex: this.handleMouseEnter
    };

    this.hoverIndex = startIndex;
    this.uiRefs = {
      container: null,
      menu: null,
      toggle: null,
      menuItems: [],
    };
    this.blockMouseEnters = false;
  }

  getStartIndex() {
    return this.props.autoSelect ? 0 : -1;
  }

  componentDidMount(prevProps) {
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
            this.hoverIndex,
            newIndex => {
              this.hoverIndex = newIndex;
              this.setState({ index: newIndex });
            }
          );
        }),

      keyDowns.subscribe(ev => {
        switch (ev.which) {
          case KEYS.ENTER:
            ev.preventDefault();
            const menuItemRef = this.uiRefs.menuItems[this.hoverIndex];
            if (menuItemRef) {
              menuItemRef.handleSelect();
              this.handleToggle();
            }
            this.uiRefs.menu.scrollTop = 0;
            this.setState({ index: -1 })
            this.hoverIndex = -1;
            return;
          case KEYS.ESC:
            ev.stopPropagation();
            this.uiRefs.toggle.focus();
          case KEYS.TAB:
            this.uiRefs.menu.scrollTop = 0;
            this.setState({ index: -1 })
            this.hoverIndex = -1;
            if (this.state.show) {
              this.handleToggle();
              this.props.onHide();
            }
            return;
          default:
            if (!this.state.show) {
              this.handleToggle();
            }
            return;
        }
      }),

      mouseMoves.subscribe(() => {
        this.blockMouseEnters = false;
      }),

      this.menuItemMouseEnters.subscribe(index => {
        if (this.blockMouseEnters) {
          return;
        }
        this.hoverIndex = index;
        if (this.state.index > -1) {
          this.setState({ index: -1 });
        }
      }),

      mouseLeaves.subscribe(() => {
        this.hoverIndex = -1;
        this.setState({ index: -1 })
      })
    ];
  }

  handleMouseEnter = index => this.menuItemMouseEnters.next(index);

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
    this.hoverIndex = startIndex;
    this.setState({
      show: !this.state.show,
      index: startIndex
    });
  }

  handleClickOutside = e => {
    if (!this.uiRefs.container || this.uiRefs.container.contains(e.target)) {
      return;
    }
    this.handleToggle();
    this.props.onHide();
  }

  registerMenuItem = (index, ref) => {
    if (index === 0) {
      this.uiRefs.menuItems = [];
    }
    this.uiRefs.menuItems[index] = ref;
  }

  render() {
    const additionalToggleProps = {
      refs: this.uiRefs,
      expanded: this.state.show,
      index: this.state.index,
      onToggle: this.handleToggle,
    };
    const additionalMenuProps = {
      refs: this.uiRefs,
      registerMenuItem: this.registerMenuItem,
      index: this.state.index,
      onToggle: this.handleToggle,
      onClick: ev => {
        ev.stopPropagation();
        this.handleToggle();
      }
    };
    const childrenArray = React.Children.toArray(this.props.children);
    const Toggle = React.cloneElement(childrenArray[0], additionalToggleProps);
    const Menu = React.cloneElement(childrenArray[1], additionalMenuProps);

    return (
      <div className={`lookahead-container${this.state.show ? ' opened' : ''}${this.state.index > -1 ? ' keyboard-controlled' : ''}`}
           ref={el => { this.uiRefs.container = el; }}>
        {Toggle}
        <FocusContext.Provider value={this.state}>
          {Menu}
        </FocusContext.Provider>
      </div>
    );
  }
}

export const DropdownButton = React.forwardRef(({refs, expanded, index, onToggle, className, ...props}, ref) => (
  <button
    {...props}
    aria-expanded={expanded}
    aria-haspopup="listbox"
    className={`${className || ''}${expanded ? ' active' : ''}`}
    ref={button => {
      ref && ref(button);
      refs.toggle = button;
    }}
    onClick={ev => {
      refs.toggle.focus();
      props.onClick && props.onClick(ev);
      onToggle();
    }}
  />
));

let genId = prefix =>
  `${prefix}-${Math.random()
    .toString(32)
    .substr(2, 8)}`;

export const DropdownInput = React.forwardRef(({refs, expanded, index, onToggle, ...props}, ref) => {
  return (
    <div
      role="combobox"
      aria-expanded={expanded}
      aria-owns="menu-listbox"
      aria-haspopup="listbox"
      id="input-combobox">
      <Input
        {...props}
        aria-autocomplete="list"
        aria-controls="menu-listbox"
        aria-activedescendant={index > -1 ? `result-${index}` : null}
        autoComplete="off"
        inputRef={input => {
          ref && ref(input);
          refs.toggle = input;
        }}
        onFocus={ev => {
          refs.toggle.focus();
          props.onFocus && props.onFocus(ev);
          onToggle();
        }}
      />
    </div>
  );
});

export class DropdownMenu extends React.Component {
  render() {
    return (
      <ul
        id="menu-listbox"
        role="listbox"
        tabIndex="-1"
        ref={ref => { this.props.refs.menu = ref }}
        style={this.props.menuStyle}
        onClick={this.props.onClick}>
        {React.Children.map(this.props.children, (child, index) => (
          React.cloneElement(child, {
            ref: ref => { this.props.registerMenuItem(index, ref); },
            index,
          })
        ))}
      </ul>
    );
  }
}

export class DropdownSearchResultsMenu extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    renderResult: PropTypes.func.isRequired,
    renderEmptyState: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results && this.props.results.length > 0) {
      this.menu.scrollTop = 0;
    }
  }

  render() {
    return (
      <ul
        id="menu-listbox"
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
          results={this.props.results}
          isSelected={this.props.isSelected}
          onSelect={this.props.onSelect}
          renderResult={this.props.renderResult}
        />
      </ul>
    );
  }
}

class SearchResults extends React.PureComponent {
  render() {
    const { props } = this;
    return props.results.map((sug, i) =>
      <MenuItem
        key={i}
        ref={ref => {
          this.props.registerMenuItem(i, ref);
        }}
        index={i}
        selected={props.isSelected(sug)}
        onSelect={() => props.onSelect(sug)}>
        {props.renderResult(sug)}
      </MenuItem>
    );
  }
}

export class MenuItem extends React.Component {
  handleSelect = () => {
    this.props.onSelect && this.props.onSelect();
  };

  handleMouseEnter = () => {
    this.context.updateIndex(this.props.index);
  }

  render() {
    const { index } = this.props;
    let className = '';
    const focused = this.context.index === index;
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

function isDownArrow(ev) {
  return ev.which === KEYS.DOWN;
}

function isUpArrow(ev) {
  return ev.which === KEYS.UP;
}

function handleArrowKey(ev, uiRefs, hoverIndex, setIndex) {
  const numberOfItems = uiRefs.menuItems.length;
  let newIndex = isDownArrow(ev) ? hoverIndex + 1 : hoverIndex - 1;
  if (newIndex === numberOfItems) {
    newIndex = 0;
  } else if (newIndex === -1) {
    newIndex = numberOfItems - 1;
  }

  const menuItemRef = uiRefs.menuItems[newIndex];
  if (!menuItemRef) {
    setIndex(-1);
    return;
  }
  setIndex(newIndex);
  const rect = menuItemRef.container.getBoundingClientRect();
  const menuRect = uiRefs.menu.getBoundingClientRect();

  let diff = rect.bottom - menuRect.bottom;
  if (diff > 0) {
    uiRefs.menu.scrollTop = uiRefs.menu.scrollTop + diff;
    return;
  }
  diff = rect.top - menuRect.top;
  if (diff < 0) {
    uiRefs.menu.scrollTop = uiRefs.menu.scrollTop + diff;
  }
}
