import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const AddressIcon = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    stroke="#2c3e50"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    {...props}>
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
    <Path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
  </Svg>
);
export default AddressIcon;
