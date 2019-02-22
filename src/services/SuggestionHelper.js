import _ from 'lodash';
import {findWithKeysMatching} from '../utils/collection-utils';
import {EMPTY_ARRAY} from '../constants';

export default class SuggestionHelper {
  suggestionData = null;
  awaitingSuggestionData = null;
  loadFailed = false;

  constructor({ source, fieldToMatch }) {
    this.source = source;
    this.fieldToMatch = fieldToMatch;
  }

  initSuggestions() {
    if (!this.awaitingSuggestionData) {
      this.awaitingSuggestionData = [];
      this.source()
        .then(data => {
          this.suggestionData = _.sortBy(data, this.fieldToMatch);
          this.awaitingSuggestionData.forEach(pending => pending[0]());
          this.awaitingSuggestionData = EMPTY_ARRAY;
        })
        .catch(() => {
          this.awaitingSuggestionData.forEach(pending => pending[1]());
          this.awaitingSuggestionData = EMPTY_ARRAY;
          this.loadFailed = true;
        })
    }

    return new Promise((resolve, reject) => {
      if (this.loadFailed) {
        return reject();
      }
      this.awaitingSuggestionData.push([resolve, reject]);
    });
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

  getSuggestions(query) {
    return this.ensureReadyToSuggest()
      .then(() => {
        if (_.isUndefined(query)) {
          return this.suggestionData;
        }
        return findWithKeysMatching(this.suggestionData, this.fieldToMatch, query)
      })
      .catch(() => EMPTY_ARRAY)
  }
}
