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
      this.state = {
        // This is used to force a render, to fix "showsMyLocationButton"
        // When the map is ready, marginBottom will be set to 0
        // @see https://github.com/react-community/react-native-maps/issues/2010
        // @see https://github.com/react-community/react-native-maps/issues/1033
        // @see https://github.com/react-community/react-native-maps/search?q=showsMyLocationButton&type=Issues
        marginBottom: 1
      }
    }

    onMapReady() {
      this.setState({ marginBottom: 0 })

      if (this.props.hasOwnProperty('onMapReady')) {
        this.props.onMapReady()
      }
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

      if (passThroughProps.hasOwnProperty('onMapReady')) {
        delete passThroughProps.onMapReady
      }

      return (
        <MapView
          style={ [ styles.map, { marginBottom: this.state.marginBottom } ] }
          ref={ forwardedRef }
          initialRegion={ initialRegion }
          zoomEnabled={ true }
          zoomControlEnabled={ true }
          showsUserLocation
          showsMyLocationButton={ true }
          loadingEnabled
          loadingIndicatorColor={"#666666"}
          loadingBackgroundColor={"#eeeeee"}
          onMapReady={ () => this.onMapReady() }
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
