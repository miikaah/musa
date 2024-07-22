import { useState } from "react";

export const useMemoizedApiCall = <T>(
  hash: string,
  callback: () => Promise<T>,
) => {
  const [data, setData] = useState<Record<string, T>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    const maybeData = data[hash];
    if (maybeData) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await callback();
      setData({
        ...data,
        [hash]: result,
      });
    } catch (err: any) {
      setError(`${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { currentData: data[hash], isLoading, error, fetchData };
};
