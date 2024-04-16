import { center, featureCollection, point } from '@turf/turf';
import _ from 'lodash';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

class NavigationAwareMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapDimensions: [],
      canRenderMap: false,
    };
  }

  componentDidMount() {
    this.unsubscribeFromFocusListener = this.props.navigation.addListener(
      'focus',
      () => this.setState({ canRenderMap: true }),
    );
  }

  componentWillUnmount() {
    this.unsubscribeFromFocusListener();
  }

  _onMapLayout(e) {
    const { width, height } = e.nativeEvent.layout;
    this.setState({ mapDimensions: [width, height] });
  }

  render() {
    const { canRenderMap, mapDimensions } = this.state;

    if (!canRenderMap) {
      return <View style={[styles.map, { backgroundColor: '#eeeeee' }]} />;
    }

    // @see https://stackoverflow.com/questions/46568465/convert-a-region-latitudedelta-longitudedelta-into-an-approximate-zoomlevel/
    const zoomLevel = 12;
    const distanceDelta = Math.exp(Math.log(360) - zoomLevel * Math.LN2);

    let aspectRatio = 1;
    if (mapDimensions.length > 0) {
      const [width, height] = mapDimensions;
      aspectRatio = width / height;
    }

    let otherProps = {};

    const markers = _.filter(
      React.Children.toArray(this.props.children),
      child => child.type === Marker,
    );

    if (markers.length > 1) {
      const features = markers.map(marker =>
        point([
          marker.props.coordinate.latitude,
          marker.props.coordinate.longitude,
        ]),
      );

      const centerFeature = center(featureCollection(features));

      // TODO Convert bounding box to region
      // https://gist.github.com/jhesgodi/4f6c443c77c8a3dcc7e1f15a80bfdc68
      // https://gist.github.com/mpontus/a6a3c69154715f2932349f0746ff81f2
      // https://github.com/react-native-community/react-native-maps/issues/884

      const region = {
        latitude: centerFeature.geometry.coordinates[0],
        longitude: centerFeature.geometry.coordinates[1],
        latitudeDelta: distanceDelta,
        longitudeDelta: distanceDelta * aspectRatio,
      };

      otherProps = {
        ...otherProps,
        initialRegion: region,
        region,
      };
    }

    return (
      <MapView
        style={styles.map}
        zoomEnabled
        showsUserLocation
        loadingEnabled
        loadingIndicatorColor={'#666666'}
        loadingBackgroundColor={'#eeeeee'}
        onLayout={this._onMapLayout.bind(this)}
        {...otherProps}>
        {this.props.children}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default NavigationAwareMap;
