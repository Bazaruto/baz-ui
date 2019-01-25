const noop = () => {}

export function createOperationStatusMiddleware({ onShowBusy = noop, onHideBusy = noop, onShowSuccess = noop }) {
  return store => next => action => {
    if (hasOperation(action)) {
      const { operation } = action.meta;
      if (!isResponse(action)) {
        if (operation.busy) {
          onShowBusy(operation.busy);
        }
        return;
      }

      onHideBusy();
      if (action.error) {
        return;
      }
      onShowSuccess(operation.done);
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
