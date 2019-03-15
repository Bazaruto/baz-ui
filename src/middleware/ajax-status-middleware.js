import {noop} from '../constants';

export function createAjaxStatusMiddleware({ onShowBusy = noop,
                                             onHideBusy = noop,
                                             onShowSuccess = noop }) {
  return () => next => action => {
    if (hasOperation(action)) {
      const { operation } = action.meta;
      if (!isResponse(action)) {
        if (operation.busy) {
          onShowBusy(operation.busy);
        }
      } else {
        onHideBusy();
        if (!action.error && operation.done) {
          onShowSuccess(operation.done);
        }
      }
    }

    return next(action);
  }
}

const responseRegex = /(_RESPONSE|_ERROR)$/;
function isResponse(action) {
  return responseRegex.test(action.type);
}

function hasOperation(action) {
  return action.meta && action.meta.operation;
}