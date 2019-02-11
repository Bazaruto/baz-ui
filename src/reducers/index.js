export { default as indicator } from './factories/createIndicator';
export { default as completedIndicator } from './factories/createCompletedIndicator';
export { default as payloadAssignor } from './factories/createPayloadAssignor';
export { default as payloadPlucker } from './factories/createPayloadPlucker';
export { default as createReducer } from './factories/createReducer';

export { default as makeClearable } from './higher-order/makeClearable';

export { patchIndexAt, patchIndex, patchIndexIfExists, createIndexPatcher } from './helpers';
