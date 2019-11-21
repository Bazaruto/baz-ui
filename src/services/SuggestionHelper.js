import {isUndefined} from 'lodash';
import {findWithMatchingFields} from '../utils/collection-utils';
import {EMPTY_ARRAY} from '../constants';
import {Promise} from 'es6-promise';

export default class SuggestionHelper {
  suggestionData = null;
  suggestionsById = {};
  awaitingSuggestionData = null;

  constructor({ uid='id', source, ...options }) {
    this.uid = uid;
    this.source = source;
    this.options = options;
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
          this.suggestionData = data;
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

  getSuggestions = (query, options=this.options) => {
    return this.ensureReadyToSuggest()
      .then(() => {
        if (isUndefined(query)) {
          return this.suggestionData;
        }
        return findWithMatchingFields(this.suggestionData, options, query)
      })
      .catch(() => EMPTY_ARRAY)
  }

  getSuggestion = (value) => {
    return this.ensureReadyToSuggest()
      .then(() => {
        const cacheKey = `${this.uid}-${value}`;
        let suggestion = this.suggestionsById[cacheKey];
        if (suggestion) {
          return suggestion;
        }
        suggestion = this.suggestionData.find(sug => sug[this.uid] === value);
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
