import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropdown, { DropdownInput, DropdownSearchResultsMenu } from './Dropdown';
import { Subject } from 'rxjs';
import { debounceTime, map, filter, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {EMPTY_ARRAY} from '../constants';
import _ from 'lodash';
import { generateId } from "./utils";

export default class SuggestionSelect extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.node,
    message: PropTypes.string,
    showMessage: PropTypes.bool,
    isSelected: PropTypes.func.isRequired,
    getSuggestions: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    initializing: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this._id = generateId();
    this._messageId = generateId();
  }

  state = {
    text: '',
    suggestionsByText: {},
  };

  text$ = new Subject();
  subscription = this.text$
    .pipe(
      tap(text => this.setState({ text })),
      map(text => text.trim()),
      distinctUntilChanged(),
      filter(isSearchableLength),
      filter(text => !this.hasSearchedBy(text)),
      debounceTime(500),
      switchMap(text => {
        return this.props.getSuggestions(text)
          .then(suggestions => ({ [text]: suggestions }))
          .catch(() => ({ [text]: null }))
      })
    )
    .subscribe(suggestionsPatch => {
      this.setState(state => ({
        suggestionsByText: {...state.suggestionsByText, ...suggestionsPatch}
      }));
    });

  handleTextChange = text => this.text$.next(text);

  componentDidMount() {
    const selectedValue = this.getSelectedTextValue();
    if (selectedValue) {
      this.handleTextChange(selectedValue);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.handleTextChange(this.getSelectedTextValue());
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  handleSelect = sug => {
    this.setState({ text: this.getSelectedTextValue() });
    this.props.onChange(sug);
  }

  handleHide = () => {
    const selectedValue = this.getSelectedTextValue();
    if (this.state.text === selectedValue) {
      return;
    }
    this.setState({ text: '' });
    if (selectedValue) {
      this.props.onChange({})
    }
  }

  handleInputFocus = () => {
    if (_.isEmpty(this.state.suggestionsByText)) {
      // Warm up the suggestion cache
      this.props.getSuggestions();
    }
  }

  getSelectedTextValue() {
    const { value } = this.props;
    return _.isNil(value) ? '' : value + '';
  }

  getSuggestionsBy(text) {
    return this.state.suggestionsByText[text] || EMPTY_ARRAY;
  }

  hasSearchedBy(text) {
    return !!this.state.suggestionsByText[text];
  }

  render() {
    const id = this.props.id || this._id;
    const messageId = this._messageId;
    const messageToShow = this.props.showMessage && this.props.message;

    const { state, props } = this;
    const trimmedText = state.text.trim();
    const suggestions = this.getSuggestionsBy(trimmedText);
    const selectedValue = this.getSelectedTextValue();

    return (
      <div className={'form-group' + (messageToShow ? ' has-error' : '')}>
        {this.props.label && (
          <label className="control-label" htmlFor={id}>
            {this.props.label}
            {this.props.required && <span className="required-asterisk"> *</span>}
          </label>
        )}
        <Dropdown onHide={this.handleHide}>
          <DropdownInput
            id={id}
            ref={input => { this.input = input }}
            value={state.text}
            onChange={ev => this.handleTextChange(ev.target.value)}
            className="form-control"
            placeholder={selectedValue || props.placeholder}
            aria-errormessage={messageId}
            aria-invalid={!!messageToShow}
            required={this.props.required}
            disabled={this.props.initializing || this.props.disabled}
            data-initializing={this.props.initializing}
            onFocus={this.handleInputFocus}
            buttonPanel={(
              <ButtonPanel
                hasSelectedValue={!!selectedValue}
                onExpandClick={() => this.input.focus()}
                onCloseClick={() => {
                  this.input.focus();
                  this.props.onChange({});
                }}
              />
            )}
          />

          <DropdownSearchResultsMenu
            results={suggestions}
            isSelected={props.isSelected}
            onSelect={this.handleSelect}
            renderResult={props.renderSuggestion}
            renderEmptyState={() => {
              if (this.hasSearchedBy(trimmedText)) {
                return (
                  <li className="menu-helper">No results found</li>
                );
              }
              if (isSearchableLength(trimmedText)) {
                return (
                  <li className="menu-helper text-muted">Searching...</li>
                );
              }
              return (
                <li className="menu-helper">
                  Type <b>2 or more</b> characters to search
                </li>
              );
            }}
          />
        </Dropdown>
        <small
          id={messageId}
          aria-live={messageToShow ? 'polite' : 'off'}
          style={{ visibility: messageToShow ? 'visible' : 'hidden' }}
          className="block error-red-text form-text"
        >
          {messageToShow}
        </small>
      </div>
    )
  }
}

ButtonPanel.propTypes = {
  hasSelectedValue: PropTypes.bool.isRequired,
  onExpandClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

function ButtonPanel(props) {
  return (
    <Fragment>
      <button type="button" tabIndex={-1} onClick={props.onExpandClick} className="btn btn-sm float-right">
        <i style={{opacity: '0.5'}} className="glyphicon glyphicon-triangle-bottom"/>
      </button>
      {props.hasSelectedValue && (
        <button
          type="button"
          tabIndex={-1}
          className="btn btn-sm close"
          style={{ fontWeight: 500 }}
          onClick={props.onCloseClick}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </Fragment>
  );
}

function isSearchableLength(val) {
  return val.length >= 2;
}
