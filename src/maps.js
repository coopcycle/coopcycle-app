import React, { Component, forwardRef } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import Settings from './Settings'

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})

const latitudeDelta = 0.0722;
const longitudeDelta = 0.0221;

export const withDefaults = (MapView) => {

  class MapViewWithDefaults extends Component {

    constructor(props) {
      super(props);
    }

    render() {

      const [ latitude, longitude ] = Settings.get('latlng').split(',').map(parseFloat)
      const initialRegion = {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      }

      const { forwardedRef, ...rest } = this.props
      const { extraProp, ...passThroughProps } = rest

      return (
        <MapView
          style={ styles.map }
          ref={ forwardedRef }
          initialRegion={ initialRegion }
          zoomEnabled={ true }
          zoomControlEnabled={ true }
          showsUserLocation
          showsMyLocationButton={ false }
          loadingEnabled
          loadingIndicatorColor={"#666666"}
          loadingBackgroundColor={"#eeeeee"}
          { ...passThroughProps }>
          { this.props.children }
        </MapView>
      );
    }

  }

  return forwardRef((props, ref) => {
    return <MapViewWithDefaults { ...props } forwardedRef={ ref } />;
  });

}
