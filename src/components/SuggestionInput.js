import React, { Fragment } from 'react';
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
    placeholder: PropTypes.string,
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

  componentDidMount() {
    const selectedValue = this.getSelectedTextValue();
    if (selectedValue) {
      this.handleTextChange(selectedValue);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedValue !== prevProps.selectedValue) {
      this.handleTextChange(this.getSelectedTextValue());
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  handleSelect = sug => {
    this.setState({ text: this.getSelectedTextValue() });
    this.props.onSelect(sug);
  }

  handleHide = () => {
    const selectedValue = this.getSelectedTextValue();
    if (this.state.text === selectedValue) {
      return;
    }
    this.setState({ text: '' });
    if (selectedValue) {
      this.props.onSelect({})
    }
  }

  handleInputFocus = () => {
    if (_.isEmpty(this.state.suggestionsByText)) {
      // Warm up the suggestion cache
      this.props.getSuggestions();
    }
  }

  getSelectedTextValue() {
    return (this.props.selectedValue || '') + '';
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
    const selectedValue = this.getSelectedTextValue();

    return (
      <Dropdown onHide={this.handleHide} autoSelect>
        <DropdownInput
          ref={input => { this.input = input }}
          value={state.text}
          onChange={this.handleTextChange}
          placeholder={selectedValue || props.placeholder}
          onFocus={this.handleInputFocus}
          panel={(
            <ButtonPanel
              hasSelectedValue={!!selectedValue}
              onExpandClick={() => this.input.focus()}
              onCloseClick={() => {
                this.input.focus();
                this.props.onSelect({});
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
      <button tabIndex={-1} onClick={props.onExpandClick} className="btn btn-sm float-right">
        <i style={{opacity: '0.5'}} className="glyphicon glyphicon-triangle-bottom"/>
      </button>
      {props.hasSelectedValue && (
        <button
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
