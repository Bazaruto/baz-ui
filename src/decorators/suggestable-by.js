import SuggestionHelper from './SuggestionHelper';

export function suggestableBy(fieldToMatch) {
  return function (elementDescriptor) {
    const { key, descriptor } = elementDescriptor;

    const initializer = function() {
      const originalServiceMethod = this[key].bind(this);
      const helper = new SuggestionHelper(originalServiceMethod, fieldToMatch);
      return helper.getSuggestions.bind(helper);
    }

    elementDescriptor.extras = [{
      kind: 'field',
      key,
      placement: 'own',
      initializer,
      descriptor: { ...descriptor, value: undefined }
    }];
    return elementDescriptor;
  }
}
