import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Dropdown, { DropdownInput, DropdownSearchResultsMenu } from './Dropdown';
import { Subject } from 'rxjs';
import { debounceTime, map, filter, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {EMPTY_ARRAY} from '../constants';
import _ from 'lodash';

export default class SuggestionInput extends React.Component {
  static propTypes = {
    selectedValue: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    onSelect: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    getSuggestions: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
  };

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
        return this.props.getSuggestions(text).then(suggestions => ({ [text]: suggestions }))
      })
    )
    .subscribe(suggestionsPatch => {
      this.setState(state => ({
        suggestionsByText: {...state.suggestionsByText, ...suggestionsPatch}
      }));
    });

  handleTextChange = text => this.text$.next(text);

  get selectedTextValue() {
    return (this.props.selectedValue || '') + '';
  }

  componentDidMount() {
    if (this.props.selectedValue) {
      this.handleTextChange(this.selectedTextValue);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedValue !== prevProps.selectedValue) {
      this.handleTextChange(this.selectedTextValue);
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  handleSelect = sug => {
    this.setState({ text: this.selectedTextValue });
    this.props.onSelect(sug);
  }

  handleHide = () => {
    if (this.state.text === this.selectedTextValue) {
      return;
    }
    this.setState({ text: '' });
    if (this.props.selectedValue) {
      this.props.onSelect({})
    }
  }

  getSuggestionsBy(text) {
    return this.state.suggestionsByText[text] || EMPTY_ARRAY;
  }

  hasSearchedBy(text) {
    return !!this.state.suggestionsByText[text];
  }

  render() {
    const { state, props } = this;
    const trimmedText = state.text.trim();
    const suggestions = this.getSuggestionsBy(trimmedText);

    return (
      <Dropdown
        onHide={this.handleHide}
        autoSelect
        startIndex={0}>
        <DropdownInput
          ref={input => { this.input = input }}
          onFocus={() => {
            if (_.isEmpty(state.suggestionsByText)) {
              // Prefetch suggestions
              props.getSuggestions();
            }
          }}
          placeholder={this.selectedTextValue || props.placeholder}
          value={state.text}
          onChange={ this.handleTextChange}
          panel={(
            <span>
              <span onClick={() => this.input.focus()} className="btn btn-sm float-right">
                <i style={{opacity: '0.5'}} className="glyphicon glyphicon-triangle-bottom"/>
              </span>
              {props.selectedValue && (
                <span
                  className="close"
                  style={{ fontWeight: 500 }}
                  onClick={ev => {
                    this.input.focus();
                    this.props.onSelect({})
                  }}>
                  <span aria-hidden="true">×</span>
                </span>
              )}
            </span>
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
    )
  }
}

function isSearchableLength(val) {
  return val.length >= 2;
}
