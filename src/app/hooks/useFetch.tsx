import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { API_DOMAIN } from "../constants";

export default (url: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});

  const request = useCallback((options = {}) => {
    setOptions(options);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    let skipGetResponseAfterDestroy = false;
    if (!isLoading) {
      return;
    }

    const requestOptions = {
      headers: { "Content-type": "application/json; charset=utf-8" },
      ...options,
    };

    axios(`${API_DOMAIN}/${url}`, requestOptions)
      .then(res => {
        if (!skipGetResponseAfterDestroy) {
          setResponse(res.data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        if (!skipGetResponseAfterDestroy) {
          setError(error.response && error.response.data);
          setIsLoading(false);
        }
      });
    return () => {
      skipGetResponseAfterDestroy = true;
    };
  }, [isLoading, url, options]);

  return [{ isLoading, response, error }, request];
};
