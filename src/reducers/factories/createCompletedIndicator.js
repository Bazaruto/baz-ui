export default function createCompletedIndicator(type) {
  const response = `${type}_RESPONSE`;

  return (state = false, action) => {
    switch (action.type) {
      case type:
        return false;

      case response:
        return !action.error;

      default:
        return state;
    }
  };
}
