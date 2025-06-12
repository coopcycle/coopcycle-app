import _  from 'lodash';
import { Callout, Marker, Polyline } from 'react-native-maps';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import ClusteredMapView from 'react-native-maps-super-cluster';
import Foundation from 'react-native-vector-icons/Foundation';
import Modal from 'react-native-modal';

import { greyColor, whiteColor } from '../styles/common';
import { isDisplayPaymentMethodInList, loadIconKey } from './PaymentMethodInfo';
import { selectIsPolylineOn } from '../redux/Courier';
import TaskCallout from './TaskCallout';
import TaskMarker from './TaskMarker';

const clusterContainerSize = 40;

const styles = StyleSheet.create({
  map: {
    // ...StyleSheet.absoluteFillObject,
  },
  clusterContainer: {
    width: clusterContainerSize,
    height: clusterContainerSize,
    borderWidth: 1,
    borderColor: whiteColor,
    borderRadius: clusterContainerSize / 2,
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
});

const latitudeDelta = 0.0722;
const longitudeDelta = 0.0221;

const edgePadding = {
  top: 20,
  left: 20,
  bottom: 20,
  right: 20,
};

const hasSameLocation = markers => {
  const coordsArray = markers.map(
    m => `${m.location.latitude};${m.location.longitude}`,
  );
  const coordsArrayUniq = _.uniq(coordsArray);

  return coordsArrayUniq.length === 1;
};

const addressName = task => {
  const customerName = task.address.firstName
    ? [task.address.firstName, task.address.lastName].join(' ')
    : null;

  return task.address.name || customerName || task.address.streetAddress;
};

class TasksMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // This is used to force a render, to fix "showsMyLocationButton"
      // When the map is ready, marginBottom will be set to 0
      // @see https://github.com/react-community/react-native-maps/issues/2010
      // @see https://github.com/react-community/react-native-maps/issues/1033
      // @see https://github.com/react-community/react-native-maps/search?q=showsMyLocationButton&type=Issues
      marginBottom: 1,
      isModalVisible: false,
      modalMarkers: [],
      mapHeight: 0,
    };

    this.renderCluster = this.renderCluster.bind(this);
    this.renderMarker = this.renderMarker.bind(this);
    this.onClusterPress = this.onClusterPress.bind(this);

    const [latitude, longitude] = this.props.mapCenter;

    this.initialRegion = {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };

    this.markers = new Map();
  }

  onMapReady(onMapReady) {
    this.setState({ marginBottom: 0 });

    if (onMapReady) {
      onMapReady();
    }
  }

  renderCluster(cluster, onPress) {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    return (
      <Marker
        identifier={`cluster-${clusterId}`}
        coordinate={coordinate}
        onPress={onPress}
        tracksViewChanges={false}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  }

  onClusterPress(clusterId, markers) {
    if (markers.length > 1 && hasSameLocation(markers)) {
      this.setState({ isModalVisible: true, modalMarkers: markers });
    }
  }

  _onModalItemPress(item) {
    this.setState(
      {
        isModalVisible: false,
        modalMarkers: [],
      },
      () => this.props.onMarkerCalloutPress(item),
    );
  }

  onCalloutPress(task) {
    this.props.onMarkerCalloutPress(task);

    const ref = this.markers.get(task['@id']);
    if (ref && ref.current) {
      ref.current.hideCallout();
    }
  }

  _getWarnings(task) {
    const warnings = [];

    if (task.address && task.address.description) {
      warnings.push({
        icon: {
          name: 'comments',
          size: 'xs',
        },
      });
    }

    if (
      task.metadata &&
      task.metadata.payment_method &&
      isDisplayPaymentMethodInList(task.metadata?.payment_method)
    ) {
      warnings.push({
        icon: {
          name: loadIconKey(task.metadata.payment_method),
          type: Foundation,
        },
      });
    }

    return warnings;
  }

  renderMarker(task) {
    const { width } = Dimensions.get('window');

    if (!this.markers.has(task['@id'])) {
      this.markers.set(task['@id'], createRef());
    }

    const warnings = this._getWarnings(task);

    return (
      <Marker
        identifier={task['@id']}
        key={task['@id']}
        coordinate={task.address.geo}
        flat={true}
        ref={this.markers.get(task['@id'])}
        tracksViewChanges={false}>
        <TaskMarker task={task} type="status" hasWarnings={warnings.length} />
        <Callout
          onPress={() => this.onCalloutPress(task)}
          style={[styles.markerCallout, { width: Math.floor(width * 0.6666) }]}>
          <TaskCallout task={task} warnings={warnings} />
        </Callout>
      </Marker>
    );
  }

  renderModal() {
    return (
      <Modal isVisible={this.state.isModalVisible} style={styles.modal}>
        <View style={{ backgroundColor: 'white' }}>
          <FlatList
            data={this.state.modalMarkers}
            keyExtractor={(item, index) => item['@id']}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalContentItem}
                onPress={() => this._onModalItemPress(item)}>
                <Text>{this.props.t('TASK_WITH_ID', { id: item.id })}</Text>
                <Text>{addressName(item)}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalFooter}
            onPress={() =>
              this.setState({ isModalVisible: false, modalMarkers: [] })
            }>
            <Text style={{ color: '#FF4136' }}>{this.props.t('CLOSE')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  render() {
    const { onMapReady, ...otherProps } = this.props;

    // Tasks must have a "location" attribute representing a GeoPoint, i.e. { latitude: x, longitude: y }
    const data = _.flatMap(this.props.taskLists, (taskList) => {
      return taskList.items.map(task => ({
        ...task,
        location: task.address.geo,
      }));
    });

    // <ClusteredMapView> has required width/height props which default to Dimensions.get('window')
    // We use onLayout() to get the actual dimensions to fill all remaining available space

    const { width } = Dimensions.get('window');

    return (
      <View
        style={{ flex: 1 }}
        onLayout={event =>
          this.setState({ mapHeight: event.nativeEvent.layout.height })
        }>
        {this.state.mapHeight && this.state.mapHeight > 0 ? (
          <ClusteredMapView
            data={data}
            style={[styles.map, { marginBottom: this.state.marginBottom }]}
            width={width}
            height={this.state.mapHeight}
            initialRegion={this.initialRegion}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation
            showsMyLocationButton={true}
            loadingEnabled
            loadingIndicatorColor={'#666666'}
            loadingBackgroundColor={'#eeeeee'}
            onMapReady={() => this.onMapReady(onMapReady)}
            edgePadding={edgePadding}
            renderCluster={this.renderCluster}
            renderMarker={this.renderMarker}
            onClusterPress={this.onClusterPress}
            {...otherProps}>
            {this.props.children}
            {this.props.isPolylineOn ? (
              this.props.taskLists.map(taskList => (
                <Polyline
                  coordinates={taskList.items.map(task => task.address.geo)}
                  strokeWidth={3}
                  strokeColor={taskList.color}
                />
              ))
            ) : null}
          </ClusteredMapView>
        ) : null}
        {this.renderModal()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isPolylineOn: selectIsPolylineOn(state),
  };
}

export default connect(mapStateToProps)(withTranslation()(TasksMapView));
