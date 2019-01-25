export const patchIndex = createIndexPatcher('id');
export const patchIndexIfExists = createIndexPatcher('id', true);

export function createIndexPatcher(indexKeyName, checkIfExists=false) {
  return (index, patch) => {
    const id = patch[indexKeyName];
    if (checkIfExists && !index[id]) {
      return index;
    }
    return {
      ...index,
      [id]: {
        ...index[id],
        ...patch
      }
    };
  };
}
