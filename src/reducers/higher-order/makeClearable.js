// Creates an higher-order reducer that clears the state for the given action type
export default function makeClearable(type) {
  return reducer => (state, action) => {
    return reducer(action.type === type ? undefined : state, action);
  }
}
