import axios from "axios";
import { useState } from "react";

const useRequest = ({ method, url, headers, data, onComplete, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doRequest = async (overrideOptions) => {
    try {
      setLoading(true);
      setError(null);

      const axiosConfig = {
        method,
        data,
        headers,
        ...overrideOptions,
        url: `${process.env.REACT_APP_API_ENDPOINT}${
          overrideOptions?.url || url
        }`
      };

      const { data: response } = await axios(axiosConfig);

      if (onComplete) {
        onComplete(response);
      }

      return response;
    } catch (err) {
      const { response, message } = err;

      if (response) {
        setError(response.data);
        if (onError) {
          onError(response.data.error);
        }
      } else {
        setError({ message });
        if (onError) {
          onError({ message });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return [doRequest, { loading, error }];
};

export default useRequest;
