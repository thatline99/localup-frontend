// NOTE: 사용 보류

"use client";

import { useCallback, useState } from "react";
import type { BaseResponse } from "@/types/common/baseResponse";

export function useApi<P extends unknown[], T>(
  request: (...args: P) => Promise<BaseResponse<T | null>>,
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await request(...args);

        if (response.code !== "SUCCESS") {
          throw new Error(response.message || "Invalid response");
        }

        const responseData = response.data ?? null;

        setData(responseData);

        return responseData;
      } catch (caught: unknown) {
        const err =
          caught instanceof Error ? caught : new Error("Unknown error");
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request],
  );

  return { loading, data, error, execute };
}
