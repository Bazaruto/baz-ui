import SuggestionHelper from './SuggestionHelper';

export default function suggest(fieldToMatch) {
  return function (elementDescriptor) {
    const { kind, key, descriptor } = elementDescriptor;

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
