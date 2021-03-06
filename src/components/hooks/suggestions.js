import {useEffect, useState} from 'react';
import {EMPTY_OBJECT, noop} from '../../constants';

export function useSuggestion(value, getByValue, onChange=noop, valueKey='id') {
  const [suggestionsById, setSuggestionsById] = useState({});
  const [isLoadingById, setIsLoadingById] = useState({});
  const suggestion = suggestionsById[value];
  useEffect(
    () => {
      if (value && suggestion === undefined) {
        setIsLoadingById(s => ({...s, [value]: true}));
        getByValue(value)
          .then(sug => setSuggestionsById(s => ({...s, [value]: sug})))
          .finally(() => setIsLoadingById(s => ({...s, [value]: false})));
      }
    },
    [value, suggestion]
  );

  function handleChange(sug) {
    if (sug[valueKey]) {
      setSuggestionsById({ ...suggestionsById, [sug[valueKey]]: sug });
    }
    onChange(sug);
  }

  return [
    suggestion || EMPTY_OBJECT,
    {
      loading: isLoadingById[value] || false
    },
    handleChange,
  ];
}

