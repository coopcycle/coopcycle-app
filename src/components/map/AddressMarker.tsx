import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const WIDTH = 28;
const HEIGHT = 36;

type Props = {
  color?: string;
};

/**
 * A plain map pin.
 *
 * react-native-maps drew a default pin when a Marker had no children; MapLibre
 * markers are always whatever you put inside them, so the app has to supply
 * one. Used for single-location maps (a saved address, a picked point) where
 * there is no task colour to convey.
 */
export default function AddressMarker({ color = '#e53935' }: Props) {
  return (
    <Svg width={WIDTH} height={HEIGHT} viewBox="0 0 28 36">
      <Path
        d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.7-6.3-14-14-14z"
        fill={color}
      />
      <Circle cx="14" cy="14" r="5" fill="#ffffff" />
    </Svg>
  );
}
