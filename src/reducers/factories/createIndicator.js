export default function createIndicator(type, initialState = false) {
  const response = `${type}_RESPONSE`;

  return (state = initialState, action) => {
    switch (action.type) {
      case type:
        return true;

      case response:
        return false;

      default:
        return state;
    }
  };
}
