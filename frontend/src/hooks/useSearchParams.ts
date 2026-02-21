import { useCallback } from 'react';
import { useSearchParams, type NavigateOptions } from 'react-router-dom';

export default function () {
  const [searchParams, setSearchParams] = useSearchParams();

  const setSearchParam = useCallback(
    (
      key: string,
      value: string,
      options: NavigateOptions = { replace: false },
    ) => {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set(key, value);
      setSearchParams(newParams, options);
    },
    [setSearchParams],
  );

  const getSearchParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const removeSearchParam = useCallback(
    (key: string, options: NavigateOptions = { replace: true }) => {
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete(key);
      setSearchParams(newParams, options);
    },
    [setSearchParams],
  );

  return {
    searchParams,
    setSearchParams,
    setSearchParam,
    getSearchParam,
    removeSearchParam,
  };
}
