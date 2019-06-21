import _ from 'lodash';
import {findWithKeysMatching} from '../utils/collection-utils';
import {EMPTY_ARRAY} from '../constants';
import {Promise} from 'es6-promise';

export default class SuggestionHelper {
  suggestionData = null;
  suggestionsById = {};
  awaitingSuggestionData = null;

  constructor({ source, fieldToMatch }) {
    this.source = source;
    this.fieldToMatch = fieldToMatch;
  }

  initSuggestions() {
    const isFirstInit = !this.awaitingSuggestionData;
    if (isFirstInit) {
      this.awaitingSuggestionData = [];
    }
    const promise = new Promise((resolve, reject) => {
      this.awaitingSuggestionData.push([resolve, reject]);
    });
    if (isFirstInit) {
      this.source()
        .then(data => {
          this.suggestionData = _.sortBy(data, this.fieldToMatch);
          this.awaitingSuggestionData.forEach(pending => pending[0]());
          this.awaitingSuggestionData = EMPTY_ARRAY;
        })
        .catch(() => {
          this.awaitingSuggestionData.forEach(pending => pending[1]());
          this.awaitingSuggestionData = null;
        });
    }
    return promise;
  }

  isReadyToSuggest() {
    return this.suggestionData !== null;
  }

  ensureReadyToSuggest() {
    if (this.isReadyToSuggest()) {
      return new Promise(resolve => resolve());
    }
    return this.initSuggestions();
  }

  getSuggestions = (query) => {
    return this.ensureReadyToSuggest()
      .then(() => {
        if (_.isUndefined(query)) {
          return this.suggestionData;
        }
        return findWithKeysMatching(this.suggestionData, this.fieldToMatch, query)
      })
      .catch(() => EMPTY_ARRAY)
  }

  getSuggestion = (value, options={fieldToMatch: 'id'}) => {
    return this.ensureReadyToSuggest()
      .then(() => {
        const cacheKey = `${options.fieldToMatch}-${value}`;
        let suggestion = this.suggestionsById[cacheKey];
        if (suggestion) {
          return suggestion;
        }
        suggestion = this.suggestionData.find(sug => sug[options.fieldToMatch] === value);
        if (suggestion) {
          this.suggestionsById[cacheKey] = suggestion;
          return suggestion
        }
        return null;
      });
  }

  clearCache = () => {
    this.suggestionData = null;
    this.suggestionsById = {};
    this.awaitingSuggestionData = null;
  }
}
