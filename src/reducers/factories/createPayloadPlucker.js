import _ from 'lodash';

export default function createPayloadPlucker(type, pathToPluck, initialState=null) {
  return (state = initialState, action) => {
    switch (action.type) {
      case type:
        return action.error || action.payload === undefined ? state : _.get(action.payload, pathToPluck);

      default:
        return state;
    }
  };
}
