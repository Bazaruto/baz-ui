export default function createPayloadAssignor(type, initialState=null) {
  return (state = initialState, action) => {
    switch (action.type) {
      case type:
        return action.error || action.payload === undefined ? state : action.payload;

      default:
        return state;
    }
  };
}
