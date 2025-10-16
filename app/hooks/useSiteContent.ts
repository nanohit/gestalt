"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cloneSiteContent, defaultContent, SiteContent } from "@/app/lib/content";
import type { ApiResponse } from "@/app/lib/routes";

const API_ENDPOINT = "/api/content";

type UpdateQueueItem = SiteContent;

export type ContentStatus = "idle" | "loading" | "saving" | "error";

export function useSiteContent(isAdmin: boolean) {
  const [content, setContent] = useState<SiteContent>(() => cloneSiteContent(defaultContent));
  const [status, setStatus] = useState<ContentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const pendingQueue = useRef<UpdateQueueItem[]>([]);
  const isSavingRef = useRef(false);

  const loadContent = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT, { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<SiteContent>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Неизвестная ошибка" : payload.error);
      }
      setContent(cloneSiteContent(payload.data));
      setStatus("idle");
    } catch (err) {
      console.error("Failed to load site content", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные");
    }
  }, []);

  const flushQueue = useCallback(async () => {
    if (!isAdmin) {
      pendingQueue.current = [];
      return;
    }
    if (isSavingRef.current || pendingQueue.current.length === 0) {
      return;
    }
    const nextContent = pendingQueue.current[pendingQueue.current.length - 1];
    pendingQueue.current = [];
    isSavingRef.current = true;
    setStatus("saving");
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });
      const payload = (await response.json()) as ApiResponse<SiteContent>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Неизвестная ошибка" : payload.error);
      }
      setContent(cloneSiteContent(payload.data));
      setStatus("idle");
    } catch (err) {
      console.error("Failed to save site content", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Не удалось сохранить изменения");
    } finally {
      isSavingRef.current = false;
      if (pendingQueue.current.length > 0) {
        void flushQueue();
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (!isAdmin) {
      pendingQueue.current = [];
      isSavingRef.current = false;
      setStatus((prev) => (prev === "saving" ? "idle" : prev));
    }
  }, [isAdmin]);

  const setContentState = useCallback(
    (updater: (prev: SiteContent) => SiteContent) => {
      setContent((prev) => {
        const updated = updater(prev);
        const next = cloneSiteContent(updated);
        if (isAdmin) {
          pendingQueue.current.push(next);
          void flushQueue();
        }
        return next;
      });
    },
    [flushQueue, isAdmin],
  );

  const reload = useCallback(() => {
    pendingQueue.current = [];
    isSavingRef.current = false;
    void loadContent();
  }, [loadContent]);

  return useMemo(
    () => ({
      content,
      status,
      error,
      setContentState,
      reload,
    }),
    [content, error, reload, setContentState, status],
  );
}
