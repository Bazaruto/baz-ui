import {useEffect, useMemo, useRef, useState} from 'react';
import {getUrlSearchParams} from '../../utils/dom-utils';
import {toSnakeCase} from '../../utils/collection-utils';
import $ from 'jquery';
import _ from 'lodash';

const noopFormify = p => p;

export function useUrlSearchParamState({ formify=noopFormify,
                                         paramify=toSnakeCase }) {
  const initialState = useMemo(() => formify(getUrlSearchParams()), []);
  const [form, setForm] = useState(initialState);

  function handlePushState(state=form) {
    const currentUrlParams = getUrlSearchParams();
    if (_.isEmpty(state) && _.isEmpty(currentUrlParams)) {
      return;
    }
    const currentUrlState = formify(currentUrlParams);
    if (!_.isEqual(currentUrlState, state)) {
      const newParams = paramify(state);
      let newHistory = window.location.pathname;
      if (!_.isEmpty(newParams)) {
        newHistory += ('?' + $.param(newParams));
      }
      window.history.pushState(state, null, newHistory);
    }
  }

  const formRef = useRef(null);
  useEffect(() => { formRef.current = form; });

  useEffect(() => {
    function listener() {
      const currentUrlState = formify(getUrlSearchParams());
      if (!_.isEqual(currentUrlState, formRef.current)) {
        setForm(currentUrlState); // Sync with url state
      }
    }
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, []);

  return [form, setForm, handlePushState];
}
