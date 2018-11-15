import React, { Component } from 'react'
import { StyleSheet, Dimensions, View, Text } from 'react-native'
import { Marker, Callout } from 'react-native-maps'
import ClusteredMapView from 'react-native-maps-super-cluster'
import Settings from '../Settings'
import { greenColor, redColor, greyColor, whiteColor } from '../styles/common'

const clusterContainerSize = 40

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  clusterContainer: {
    width: clusterContainerSize,
    height: clusterContainerSize,
    borderWidth: 1,
    borderColor: whiteColor,
    borderRadius: (clusterContainerSize / 2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: greyColor,
  },
  clusterText: {
    fontSize: 13,
    color: whiteColor,
    textAlign: 'center',
  },
  markerCalloutText: {
    fontSize: 14
  },
  tagContainer: {
    textAlign: 'center',
    color: whiteColor,
    fontSize: 14,
    paddingHorizontal: 15,
    width: '60%'
  }
})

const latitudeDelta = 0.0722;
const longitudeDelta = 0.0221;

const pinColor = task => {

  let pinColor = greyColor

  if (task.status === 'DONE') {
    pinColor = greenColor
  }

  if (task.status === 'FAILED') {
    pinColor = redColor
  }

  return pinColor
}

class TasksMapView extends Component {

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

  onMapReady(onMapReady) {
    this.setState({ marginBottom: 0 })

    if (onMapReady) {
      onMapReady()
    }
  }

  renderCluster(cluster, onPress) {

    const pointCount = cluster.pointCount,
          coordinate = cluster.coordinate,
          clusterId = cluster.clusterId

    return (
      <Marker identifier={ `cluster-${clusterId}` } coordinate={ coordinate } onPress={ onPress }>
        <View style={ styles.clusterContainer }>
          <Text style={ styles.clusterText }>
            { pointCount }
          </Text>
        </View>
      </Marker>
    )
  }

  renderMarker(task) {
    return (
      <Marker
        identifier={ task['@id'] }
        key={ task['@id'] }
        coordinate={ task.address.geo }
        pinColor={ pinColor(task) }
        flat={ true }>
        <Callout onPress={ () => this.props.onMarkerCalloutPress(task) }>
          { task.address.name && (<Text style={ styles.markerCalloutText }>{ task.address.name }</Text>) }
          <Text style={ styles.markerCalloutText }>
            { task.address.streetAddress }
          </Text>
          {
            task.tags.map((tag, index) => (
              <Text key={ index } style={ [ styles.tagContainer, { backgroundColor: tag.color } ] }>
                { tag.name }
              </Text>
            ))
          }
        </Callout>
      </Marker>
    )
  }

  render() {

    const [ latitude, longitude ] = Settings.get('latlng').split(',').map(parseFloat)
    const initialRegion = {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    }

    const { onMapReady, ...otherProps } = this.props

    // Objects must have an attribute location representing a GeoPoint, i.e. { latitude: x, longitude: y }
    const data = this.props.tasks.map(task => ({ ...task, location: task.address.geo }))

    return (
      <ClusteredMapView
        data={ data }
        style={ [ styles.map, { marginBottom: this.state.marginBottom } ] }
        ref={ ref => { this.map = ref } }
        initialRegion={ initialRegion }
        zoomEnabled={ true }
        zoomControlEnabled={ true }
        showsUserLocation
        showsMyLocationButton={ true }
        loadingEnabled
        loadingIndicatorColor={"#666666"}
        loadingBackgroundColor={"#eeeeee"}
        onMapReady={ () => this.onMapReady(onMapReady) }
        renderCluster={ this.renderCluster.bind(this) }
        renderMarker={ this.renderMarker.bind(this) }
        { ...otherProps }>
        { this.props.children }
      </ClusteredMapView>
    );
  }

}

export default TasksMapView
