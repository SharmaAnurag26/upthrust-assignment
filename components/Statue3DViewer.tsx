"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

// <model-viewer> is a web component; React passes attributes through as-is.
const ModelViewer = "model-viewer" as React.ElementType;
const MODEL_VIEWER_SRC = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

// Only devices that can comfortably afford WebGL get the interactive model. Phones and tablets
// keep the poster (the same artwork, pre-rendered), which keeps mobile TBT and LCP low.
const CAN_AFFORD_3D = "(min-width: 1024px) and (pointer: fine)";

interface Statue3DViewerProps {
  posterSrc: string;
  alt: string;
  modelSrc?: string;
}

type ModelViewerEl = HTMLElement & {
  model?: {
    materials: Array<{
      setIridescenceFactor?: (v: number) => void;
      setIridescenceIor?: (v: number) => void;
      setIridescenceThicknessRange?: (v: [number, number]) => void;
      pbrMetallicRoughness: {
        setBaseColorFactor: (color: [number, number, number, number]) => void;
        setMetallicFactor: (factor: number) => void;
        setRoughnessFactor: (factor: number) => void;
      };
    }>;
  };
};

/** Subscribes to a CSS media query; always false during server rendering. */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Injects the model-viewer library (~1 MB) once the page has loaded and the browser is idle. */
function loadModelViewerWhenIdle() {
  if (customElements.get("model-viewer") || document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`)) return;

  const inject = () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SRC;
    document.head.appendChild(script);
  };
  const whenIdle = () =>
    "requestIdleCallback" in window ? window.requestIdleCallback(inject, { timeout: 3000 }) : setTimeout(inject, 1500);

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

/**
 * Progressive enhancement: the poster image is server-rendered and is the page's LCP element.
 * On capable desktops the Draco-compressed 3D model (126 KB) fades in over it once loaded.
 */
export function Statue3DViewer({ posterSrc, alt, modelSrc = "/models/statue.glb" }: Statue3DViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);
  const enable3D = useMediaQuery(CAN_AFFORD_3D);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    if (!enable3D) return;
    loadModelViewerWhenIdle();

    const viewer = viewerRef.current as ModelViewerEl | null;
    if (!viewer) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewer.removeAttribute("auto-rotate");
    }

    // Recreate the iridescent navy finish from the design on top of the model's own material.
    const handleModelLoad = () => {
      for (const mat of viewer.model?.materials ?? []) {
        mat.pbrMetallicRoughness.setBaseColorFactor([0.03, 0.05, 0.28, 1]);
        mat.pbrMetallicRoughness.setMetallicFactor(1);
        mat.pbrMetallicRoughness.setRoughnessFactor(0.06);
        mat.setIridescenceFactor?.(1);
        mat.setIridescenceIor?.(1.4);
        mat.setIridescenceThicknessRange?.([120, 480]);
      }
      setModelReady(true);
    };

    viewer.addEventListener("load", handleModelLoad);
    return () => viewer.removeEventListener("load", handleModelLoad);
  }, [enable3D]);

  return (
    <div className="relative z-20 flex h-[min(62svh,860px)] min-h-[340px] w-[min(68vw,720px)] min-w-[280px] items-center justify-center sm:h-[min(78vh,860px)] sm:min-h-[420px]">
      <Image
        src={posterSrc}
        alt={enable3D ? "" : alt} // once the 3D model takes over, it carries the alt text
        width={1092}
        height={1370}
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 1024px) 690px, 68vw"
        className={`pointer-events-none h-full w-auto object-contain transition-opacity duration-500 ${enable3D && modelReady ? "opacity-0" : "opacity-100"}`}
      />

      {enable3D && (
        <ModelViewer
          ref={viewerRef}
          src={modelSrc}
          alt={alt}
          camera-controls=""
          disable-zoom=""
          interaction-prompt="none"
          environment-image="/models/iridescent-env.png"
          shadow-intensity="0.35"
          shadow-softness="1"
          exposure="1.15"
          tone-mapping="commerce"
          camera-orbit="72deg 80deg 98%"
          min-camera-orbit="auto 68deg auto"
          max-camera-orbit="auto 98deg auto"
          field-of-view="26deg"
          auto-rotate=""
          rotation-per-second="30deg"
          auto-rotate-delay="0"
          className={`absolute inset-0 transition-opacity duration-500 ${modelReady ? "opacity-100" : "opacity-0"}`}
          style={{ width: "100%", height: "100%", backgroundColor: "transparent", cursor: "grab" }}
        />
      )}
    </div>
  );
}
