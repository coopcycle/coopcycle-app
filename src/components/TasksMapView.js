import React, {Component} from 'react'
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {Callout, Marker} from 'react-native-maps'
import ClusteredMapView from 'react-native-maps-super-cluster'
import Modal from 'react-native-modal'
import {withTranslation} from 'react-i18next'

import Settings from '../Settings'
import {
  greyColor,
  whiteColor,
} from '../styles/common'
import {uniq} from 'lodash'
import TaskMarker from './TaskMarker'

const clusterContainerSize = 40

const styles = StyleSheet.create({
  map: {
    // ...StyleSheet.absoluteFillObject,
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
  markerCallout: {
    padding: 5,
  },
  markerCalloutText: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  tagContainer: {
    textAlign: 'center',
    color: whiteColor,
    fontSize: 14,
    paddingHorizontal: 15,
    width: '60%',
  },
  modal: {
    padding: 20,
  },
  modalFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },
  modalContentItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})

const latitudeDelta = 0.0722;
const longitudeDelta = 0.0221;

const edgePadding = {
  top: 20,
  left: 20,
  bottom: 20,
  right: 20,
}

const hasSameLocation = markers => {
  const coordsArray = markers.map(m => `${m.location.latitude};${m.location.longitude}`)
  const coordsArrayUniq = uniq(coordsArray)

  return coordsArrayUniq.length === 1
}

const addressName = task => {
  const customerName = task.address.firstName ? [ task.address.firstName, task.address.lastName ].join(' ') : null

  return task.address.name || customerName || task.address.streetAddress
}

class TasksMapView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // This is used to force a render, to fix "showsMyLocationButton"
      // When the map is ready, marginBottom will be set to 0
      // @see https://github.com/react-community/react-native-maps/issues/2010
      // @see https://github.com/react-community/react-native-maps/issues/1033
      // @see https://github.com/react-community/react-native-maps/search?q=showsMyLocationButton&type=Issues
      marginBottom: 1,
      isModalVisible: false,
      modalMarkers: [],
      mapHeight: null,
    }

    this.renderCluster = this.renderCluster.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
    this.onClusterPress = this.onClusterPress.bind(this)

    const [ latitude, longitude ] = Settings.get('latlng').split(',').map(parseFloat)

    this.initialRegion = {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    }

    this.markers = new Map()
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
      <Marker
        identifier={ `cluster-${clusterId}` }
        coordinate={ coordinate }
        onPress={ onPress }
        tracksViewChanges={ false }>
        <View style={ styles.clusterContainer }>
          <Text style={ styles.clusterText }>
            { pointCount }
          </Text>
        </View>
      </Marker>
    )
  }

  onClusterPress(clusterId, markers) {
    if (markers.length > 1 && hasSameLocation(markers)) {
      this.setState({ isModalVisible: true, modalMarkers: markers })
    }
  }

  _onModalItemPress(item) {
    this.setState({
      isModalVisible: false,
      modalMarkers: [],
    }, () => this.props.onMarkerCalloutPress(item))
  }

  onCalloutPress(task) {
    this.props.onMarkerCalloutPress(task)

    const ref = this.markers.get(task['@id'])
    if (ref && ref.current) {
      ref.current.hideCallout()
    }
  }

  renderMarker(task) {

    const { width } = Dimensions.get('window')

    if (!this.markers.has(task['@id'])) {
      this.markers.set(task['@id'], React.createRef())
    }

    return (
      <Marker
        identifier={ task['@id'] }
        key={ task['@id'] }
        coordinate={ task.address.geo }
        flat={ true }
        ref={ this.markers.get(task['@id']) }
        tracksViewChanges={ false }>
        <TaskMarker task={ task } type="status" />
        <Callout onPress={ () => this.onCalloutPress(task) }
          style={ [ styles.markerCallout, { width: Math.floor(width * 0.6666) } ] }>
          { task.address.name ? (<Text style={ styles.markerCalloutText }>{ task.address.name }</Text>) : null }
          <Text style={ styles.markerCalloutText } numberOfLines={ 3 }>
            { addressName(task) }
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

  renderModal() {

    return (
      <Modal isVisible={ this.state.isModalVisible } style={ styles.modal }>
        <View style={{ backgroundColor: 'white' }}>
          <FlatList
            data={ this.state.modalMarkers }
            keyExtractor={ (item, index) => item['@id'] }
            renderItem={ ({ item }) => (
              <TouchableOpacity style={ styles.modalContentItem }
                onPress={ () => this._onModalItemPress(item) }>
                <Text>{ this.props.t('TASK_WITH_ID', { id: item.id }) }</Text>
                <Text>{ addressName(item) }</Text>
              </TouchableOpacity>
            ) } />
          <TouchableOpacity style={ styles.modalFooter }
            onPress={ () => this.setState({ isModalVisible: false, modalMarkers: [] }) }>
            <Text style={{ color: '#FF4136' }}>
              { this.props.t('CLOSE') }
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  render() {

    const { onMapReady, ...otherProps } = this.props

    // Objects must have a "location" attribute representing a GeoPoint, i.e. { latitude: x, longitude: y }
    const data = this.props.tasks.map(task => ({ ...task, location: task.address.geo }))

    // <ClusteredMapView> has required width/height props which default to Dimensions.get('window')
    // We use onLayout() to get the actual dimensions to fill all remaining available space

    const { width } = Dimensions.get('window')

    return (
      <View style={{ flex: 1 }} onLayout={ event => this.setState({ mapHeight: event.nativeEvent.layout.height }) }>
        { (this.state.mapHeight && this.state.mapHeight > 0) && (
          <ClusteredMapView
            data={ data }
            style={ [ styles.map, { marginBottom: this.state.marginBottom } ] }
            width={ width }
            height={ this.state.mapHeight }
            initialRegion={ this.initialRegion }
            zoomEnabled={ true }
            zoomControlEnabled={ true }
            showsUserLocation
            showsMyLocationButton={ true }
            loadingEnabled
            loadingIndicatorColor={ '#666666' }
            loadingBackgroundColor={ '#eeeeee' }
            onMapReady={ () => this.onMapReady(onMapReady) }
            edgePadding={ edgePadding }
            renderCluster={ this.renderCluster }
            renderMarker={ this.renderMarker }
            onClusterPress={ this.onClusterPress }
            { ...otherProps }>
            { this.props.children }
          </ClusteredMapView>
        )}
        { this.renderModal() }
      </View>
    );
  }

}

export default withTranslation()(TasksMapView)
