import React, { useMemo } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';

import { toPosition, type Coordinate } from './region';

type Props = {
  /** Stable across renders: MapLibre keys the native source on it. */
  id: string;
  coordinates: Coordinate[];
  strokeColor?: string;
  strokeWidth?: number;
  /** [dash, gap] in line widths, as react-native-maps' lineDashPattern was. */
  lineDashPattern?: number[];
};

/**
 * A line on the map.
 *
 * MapLibre has no Polyline component: geometry goes into a source and a layer
 * decides how it is painted. This keeps that two-step shape in one place so
 * call sites can carry on passing an array of coordinates.
 */
export default function Polyline({
  id,
  coordinates,
  strokeColor = '#000000',
  strokeWidth = 3,
  lineDashPattern,
}: Props) {
  const shape = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates.map(toPosition),
      },
    }),
    [coordinates],
  );

  // A line needs two points; MapLibre would otherwise render a source with
  // degenerate geometry.
  if (coordinates.length < 2) {
    return null;
  }

  return (
    <GeoJSONSource id={`${id}-source`} data={shape}>
      <Layer
        id={id}
        type="line"
        style={{
          lineColor: strokeColor,
          lineWidth: strokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
          ...(lineDashPattern ? { lineDasharray: lineDashPattern } : {}),
        }}
      />
    </GeoJSONSource>
  );
}
