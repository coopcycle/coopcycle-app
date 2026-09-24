/**
 * Map configuration.
 *
 * We render vector tiles with MapLibre instead of the Google Maps SDK. Besides
 * removing the Google dependency (and its API key), this is what makes the app
 * usable on de-Googled Android builds: microG implements the Google Maps API on
 * top of Mapbox GL, and its renderer deadlocks the main thread when the SDK
 * tears down a live GL surface.
 *
 * @see https://github.com/coopcycle/coopcycle-app/issues/9
 * @see https://github.com/coopcycle/coopcycle-app/issues/2113
 */

/**
 * OpenFreeMap serves OpenStreetMap-based vector tiles with no API key, no
 * account and no usage limits.
 *
 * @see https://openfreemap.org/
 */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/bright';

/**
 * OpenStreetMap requires attribution. MapLibre reads it from the style, but the
 * native attribution control is easy to miss, so keep the string here for
 * anywhere we need to render it ourselves.
 *
 * @see https://www.openstreetmap.org/copyright
 */
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors';

/**
 * Deepest zoom the camera allows. MapLibre Native's memory use climbs steeply
 * past this and eventually crashes the app on Android, which has no zoom cap
 * by default (iOS stops at 22). OpenFreeMap tiles stop at 14 and are overzoomed
 * beyond it, so 19 already shows individual buildings and loses nothing.
 *
 * @see https://github.com/maplibre/maplibre-native/issues/3107
 */
export const MAX_ZOOM = 19;
