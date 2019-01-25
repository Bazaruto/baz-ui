import _ from 'lodash';

export function updateArray(array, indexFinder, mapper) {
  const index = _.isFunction(indexFinder) ? _.findIndex(array, indexFinder) : indexFinder;
  if (index < 0) {
    return array;
  }
  const newArray = [].concat(array);
  newArray[index] = mapper(array[index]);
  return newArray;
}

export function removeArrayEntry(array, indexFinder) {
  const index = _.isFunction(indexFinder) ? _.findIndex(array, indexFinder) : indexFinder;
  if (index < 0) {
    return array;
  }
  const newArray = [].concat(array);
  newArray.splice(index, 1);
  return newArray;
}
