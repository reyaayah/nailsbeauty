"use client";
import { useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function useApi() {
  const { getToken } = useAdminAuth();

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      let token: string;
      try {
        token = await getToken();
      } catch (e) {
        console.error("apiFetch: failed to get token", e);
        throw e; // don't swallow — let the caller know why
      }

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers ?? {}),
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    },
    [getToken]
  );

  return { apiFetch };
}
