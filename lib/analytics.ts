/**
 * Thin wrapper around the Google Tag Manager data layer.
 *
 * Events are pushed even when GTM isn't configured, so tracking can be verified in any
 * environment by typing `dataLayer` in the browser console. Never push personal data
 * (emails, names, phone numbers): Google Analytics' terms forbid PII in events.
 */
type DataLayerEvent = { event: string } & Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushDataLayerEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  if (process.env.NODE_ENV !== "production") {
    console.info("[dataLayer] push", payload);
  }
}
