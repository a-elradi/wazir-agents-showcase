/**
 * Static "shot" mode: open the site with ?shot=1 and every animation renders at its end state,
 * typed text is complete and the hero stops filling the viewport. Used for PNG previews and
 * headless screenshots; has no effect on normal visits.
 */
export const SHOT = typeof location !== "undefined" && new URLSearchParams(location.search).has("shot");
