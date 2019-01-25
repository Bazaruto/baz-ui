export function createReducer(initialState, handlers) {
  delete handlers[undefined];
  return function(state = initialState, action) {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  }
}
