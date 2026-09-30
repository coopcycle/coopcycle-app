/**
 * Translation between the react-native-maps "region" model the app is written
 * against and the zoom/bounds model MapLibre uses.
 *
 * Keeping these conversions in one place lets the call sites keep speaking in
 * regions, which is how the rest of the app (selectors, saved map state, task
 * geo data) already describes a viewport.
 */

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

/** MapLibre wants [longitude, latitude]; the app stores the opposite order. */
export const toPosition = ({ latitude, longitude }: Coordinate): [number, number] => [
  longitude,
  latitude,
];

export const fromPosition = ([longitude, latitude]: [number, number]): Coordinate => ({
  latitude,
  longitude,
});

/**
 * A region's `longitudeDelta` spans a fraction of the 360° world, and each zoom
 * level halves what is visible, hence the log2. Latitude is left out on purpose:
 * Web Mercator stretches it away from the equator, so longitude is the honest
 * axis to derive zoom from.
 */
export const regionToZoom = (region: Region): number => {
  const delta = Math.max(region.longitudeDelta, Number.EPSILON);
  return Math.log2(360 / delta);
};

export const zoomToRegion = (
  center: Coordinate,
  zoom: number,
  aspectRatio = 1,
): Region => {
  const longitudeDelta = 360 / Math.pow(2, zoom);
  return {
    ...center,
    longitudeDelta,
    latitudeDelta: longitudeDelta / Math.max(aspectRatio, Number.EPSILON),
  };
};

/**
 * MapLibre reports the viewport as a flat [west, south, east, north] box; the
 * app expects a centre plus deltas.
 */
export const boundsToRegion = (
  [west, south, east, north]: [number, number, number, number],
): Region => ({
  latitude: (north + south) / 2,
  longitude: (east + west) / 2,
  latitudeDelta: Math.abs(north - south),
  longitudeDelta: Math.abs(east - west),
});

/**
 * Padded bounding box around a set of points, for fitting the camera.
 * Returned in MapLibre's flat [west, south, east, north] order.
 */
export const boundsForCoordinates = (
  coordinates: Coordinate[],
  paddingRatio = 0.2,
): [number, number, number, number] | null => {
  if (!coordinates.length) {
    return null;
  }

  const lats = coordinates.map(c => c.latitude);
  const lngs = coordinates.map(c => c.longitude);

  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);

  // A single point, or several stacked on one spot, has no extent to pad, so
  // fall back to a small fixed box rather than an infinitely tight camera.
  const latPad = Math.max((north - south) * paddingRatio, 0.002);
  const lngPad = Math.max((east - west) * paddingRatio, 0.002);

  return [west - lngPad, south - latPad, east + lngPad, north + latPad];
};
