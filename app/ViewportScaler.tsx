"use client";

import { useEffect } from "react";

const MOBILE_MAX_WIDTH = 768;
const MOBILE_SCALE = 0.85;
const DEFAULT_VIEWPORT_CONTENT = "width=device-width, initial-scale=1";

type ViewportParams = Record<string, string>;

function parseViewportContent(content: string): ViewportParams {
  return content
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<ViewportParams>((acc, part) => {
      const [key, value] = part.split("=").map((segment) => segment.trim());
      if (key) {
        acc[key] = value ?? "";
      }
      return acc;
    }, {});
}

function serializeViewportContent(params: ViewportParams): string {
  return Object.entries(params)
    .map(([key, value]) => (value ? `${key}=${value}` : key))
    .join(", ");
}

function getScaledContent(originalContent: string, scale: number) {
  const parsed = parseViewportContent(originalContent);
  parsed["initial-scale"] = scale.toString();
  return serializeViewportContent(parsed);
}

export default function ViewportScaler() {
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      return;
    }

    const originalContent =
      viewportMeta.getAttribute("content") ?? DEFAULT_VIEWPORT_CONTENT;
    const scaledContent = getScaledContent(originalContent, MOBILE_SCALE);

    const updateViewport = (shouldScale: boolean) => {
      const nextContent = shouldScale ? scaledContent : originalContent;
      if (viewportMeta.getAttribute("content") !== nextContent) {
        viewportMeta.setAttribute("content", nextContent);
      }
    };

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

    updateViewport(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      updateViewport(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleChange);
      }
      viewportMeta.setAttribute("content", originalContent);
    };
  }, []);

  return null;
}



