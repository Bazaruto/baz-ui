export default function createIndicator(type, initialState = false) {
  const response = `${type}_RESPONSE`;
  const errorResponse = `${type}_ERROR`;

  return (state = initialState, action) => {
    switch (action.type) {
      case type:
        return true;

      case response:
      case errorResponse:
        return false;

      default:
        return state;
    }
  };
}
