import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  Camera,
  Map as MapLibreMap,
  UserLocation,
  type CameraRef,
} from '@maplibre/maplibre-react-native';

import { MAP_STYLE_URL } from './config';
import {
  boundsForCoordinates,
  boundsToRegion,
  regionToZoom,
  toPosition,
  type Coordinate,
  type Region,
} from './region';

export type MapHandle = {
  /** Centre on a region, matching react-native-maps' animateToRegion(). */
  animateToRegion: (region: Region, duration?: number) => void;
  /** Fit the camera around a set of points. */
  fitToCoordinates: (coordinates: Coordinate[], duration?: number) => void;
};

type Props = {
  children?: React.ReactNode;
  /** Where to place the camera on first render. */
  initialRegion?: Region;
  /** Show the blue dot. Off by default, since it needs location permission. */
  showsUserLocation?: boolean;
  /** Fired once the viewport settles, with the region now visible. */
  onRegionChangeComplete?: (region: Region) => void;
  onPress?: (coordinate: Coordinate) => void;
  onLayout?: React.ComponentProps<typeof MapLibreMap>['onLayout'];
  /** Disable gestures for decorative maps. */
  interactive?: boolean;
  style?: React.ComponentProps<typeof MapLibreMap>['style'];
  testID?: string;
};

/**
 * The app's map surface.
 *
 * Wraps MapLibre so call sites keep speaking in `region` (the shape the rest of
 * the app stores and passes around) rather than MapLibre's zoom/bounds, and so
 * the tile style is configured in exactly one place.
 */
export const Map = forwardRef<MapHandle, Props>(function Map(
  {
    children,
    initialRegion,
    showsUserLocation = false,
    onRegionChangeComplete,
    onPress,
    onLayout,
    interactive = true,
    style,
    testID,
  },
  ref,
) {
  const cameraRef = useRef<CameraRef>(null);

  // Only the first value is used; later changes are driven through the ref so
  // the camera is not yanked back while the courier is panning.
  const initialViewState = useMemo(() => {
    if (!initialRegion) {
      return undefined;
    }
    return {
      center: toPosition(initialRegion),
      zoom: regionToZoom(initialRegion),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      animateToRegion: (region, duration = 500) => {
        cameraRef.current?.easeTo({
          center: toPosition(region),
          zoom: regionToZoom(region),
          duration,
        });
      },
      fitToCoordinates: (coordinates, duration = 500) => {
        const bounds = boundsForCoordinates(coordinates);
        if (!bounds) {
          return;
        }
        cameraRef.current?.fitBounds(bounds, { duration });
      },
    }),
    [],
  );

  return (
    <MapLibreMap
      style={style ?? StyleSheet.absoluteFill}
      mapStyle={MAP_STYLE_URL}
      testID={testID}
      onLayout={onLayout}
      // MapLibre renders its own attribution control; OpenStreetMap data
      // requires it to stay visible.
      attribution
      logo={false}
      compass={false}
      dragPan={interactive}
      touchZoom={interactive}
      doubleTapZoom={interactive}
      touchRotate={false}
      touchPitch={false}
      onPress={
        onPress
          ? event => {
              const [longitude, latitude] = event.nativeEvent.lngLat;
              onPress({ latitude, longitude });
            }
          : undefined
      }
      onRegionDidChange={
        onRegionChangeComplete
          ? event => {
              onRegionChangeComplete(boundsToRegion(event.nativeEvent.bounds));
            }
          : undefined
      }>
      <Camera ref={cameraRef} initialViewState={initialViewState} />
      {showsUserLocation ? <UserLocation /> : null}
      {children}
    </MapLibreMap>
  );
});

export default Map;
