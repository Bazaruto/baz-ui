import { useMemo } from 'react';
import { EMPTY_ARRAY } from '../../constants';

let counter = 0;
export function generateId() {
  return `${++counter}-uid`;
}

export function useId() {
  return useMemo(() => generateId(), EMPTY_ARRAY);
}