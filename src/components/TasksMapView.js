import _  from 'lodash';
import { Callout, Marker, Polyline } from 'react-native-maps';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { decode }from '@mapbox/polyline';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { withTranslation } from 'react-i18next';
// import ClusteredMapView from 'react-native-maps-super-cluster';
import MapView from 'react-native-maps';
import Foundation from 'react-native-vector-icons/Foundation';
import Modal from 'react-native-modal';

import { filterTasks } from '../redux/logistics/utils';
import { getTaskListTasks, getTaskTaskList } from '../shared/src/logistics/redux/taskListUtils';
import { greyColor, whiteColor } from '../styles/common';
import { isDisplayPaymentMethodInList, loadIconKey } from './PaymentMethodInfo';
import { selectIsHideUnassignedFromMap, selectIsPolylineOn } from '../redux/Courier';
import { selectTasksEntities } from '../shared/logistics/redux';
import { UNASSIGNED_TASKS_LIST_ID } from '../shared/src/constants';
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

// const hasSameLocation = markers => {
//   const coordsArray = markers.map(
//     m => `${m.location.latitude};${m.location.longitude}`,
//   );
//   const coordsArrayUniq = _.uniq(coordsArray);

//   return coordsArrayUniq.length === 1;
// };

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

    this.renderMarker = this.renderMarker.bind(this);
    // this.renderCluster = this.renderCluster.bind(this);
    // this.onClusterPress = this.onClusterPress.bind(this);
    this.map = null;

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

  // @TODO Do NOT cluster if the address is NOT exactly the same..!
  // renderCluster(cluster, onPress) {
  //   const clusterId = cluster.clusterId;
  //   const coordinate = cluster.coordinate;

  //   // Let's correctly count the markers, removing unassigned ones if the filter is enabled
  //   const clusteringEngine = this.map.getClusteringEngine();
  //   const clusteredPoints = clusteringEngine.getLeaves(clusterId, 1000);
  //   const count = clusteredPoints.reduce((acc, point) => {
  //     return acc + (this.props.isHideUnassignedFromMap && point.properties && !point.properties.item.isAssigned ? 0 : 1);
  //   }, 0);

  //   return (count === 0 ? null :
  //     <Marker
  //       identifier={`cluster-${clusterId}`}
  //       coordinate={coordinate}
  //       onPress={onPress}
  //       tracksViewChanges={false}>
  //       <View style={styles.clusterContainer}>
  //         <Text style={styles.clusterText}>{count}</Text>
  //       </View>
  //     </Marker>
  //   );
  // }

  // onClusterPress(clusterId, markers) {
  //   // Let's correctly set the clustered markers
  //   const modalMarkers = this.props.isHideUnassignedFromMap ? markers.filter((task) => task.isAssigned) : markers;

  //   if (modalMarkers.length > 1 && hasSameLocation(modalMarkers)) {
  //     this.setState({ isModalVisible: true, modalMarkers });
  //   }
  // }

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

  renderMarker(task, index) {
    // Get the corresponding task list and see if it is an unassigned one
    const taskList = getTaskTaskList(task, this.props.taskLists);
    if (taskList.isUnassignedTaskList && this.props.isHideUnassignedFromMap) {
      return null;
    }

    const { width } = Dimensions.get('window');

    if (!this.markers.has(task['@id'])) {
      this.markers.set(task['@id'], createRef());
    }

    const warnings = this._getWarnings(task);

    return (
      <Marker
        identifier={task['@id']}
        key={`${task['@id']}-${index}`}
        coordinate={task.address.geo}
        flat={true}
        ref={this.markers.get(task['@id'])}
        tracksViewChanges={false}>
        <TaskMarker
          task={task}
          taskList={taskList}
          type="status"
          hasWarnings={warnings.length}
        />
        <Callout
          onPress={() => this.onCalloutPress(task)}
          style={[styles.markerCallout, { width: Math.floor(width * 0.6666) }]}>
          <TaskCallout task={task} warnings={warnings} />
        </Callout>
      </Marker>
    );
  }

  getCoordinates(taskList) {
    const {tasksEntities} = this.props;

    if(taskList.polyline !== '') {
      const decodedCoordinates = decode(taskList.polyline).map(coords => ({
        latitude: coords[0],
        longitude: coords[1]
      }));

      return decodedCoordinates;
    }
    const taskListTasks = getTaskListTasks(taskList, tasksEntities);

    return taskListTasks.map(task => task.address.geo);
  }

  renderPolylines(taskLists) {
    if (!this.props.isPolylineOn) {
      return null;
    }

    return taskLists.map(taskList => {
      if (taskList.isUnassignedTaskList && this.props.isHideUnassignedFromMap) {
        return null;
      }

      return (
        <Polyline
          coordinates={this.getCoordinates(taskList)}
          strokeWidth={3}
          strokeColor={taskList.color}
          key={taskList.id}
          lineDashPattern={taskList.isUnassignedTaskList ? [20, 10] : null}
        />
      )
    });
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
    const {
      onMapReady,
      taskLists,
      uiFilters,
      tasksEntities,
      ...otherProps
    } = this.props;

    // Tasks must have a "location" attribute representing a GeoPoint, i.e. { latitude: x, longitude: y }
    const data = _.flatMap(taskLists, (taskList) => {
      // Do not parse unassigned tasks if the filter is enabled
      if (this.props.isHideUnassignedFromMap && taskList.id === UNASSIGNED_TASKS_LIST_ID) {
        return [];
      }
      const taskListTasks = getTaskListTasks(taskList, tasksEntities);
      const items = uiFilters ? filterTasks(taskListTasks, uiFilters) : taskListTasks;

      return items.map(task => ({
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
          <MapView
            // data={data}
            style={[styles.map, { marginBottom: this.state.marginBottom, flex: 1, minHeight: '100%', widht: '100%' }]}
            width={width}
            height={this.state.mapHeight}
            initialRegion={this.initialRegion}
            clusteringEnabled={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation
            showsMyLocationButton={true}
            loadingEnabled
            loadingIndicatorColor={'#666666'}
            loadingBackgroundColor={'#eeeeee'}
            onMapReady={() => this.onMapReady(onMapReady)}
            edgePadding={edgePadding}
            // renderMarker={this.renderMarker}
            // renderCluster={this.renderCluster}
            // onClusterPress={this.onClusterPress}
            ref={(r) => { this.map = r }}
            {...otherProps}>
            {data.map(this.renderMarker)}
            {this.renderPolylines(taskLists)}
            {this.props.children}
          </MapView>
        ) : null}
        {this.renderModal()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isHideUnassignedFromMap: selectIsHideUnassignedFromMap(state),
    isPolylineOn: selectIsPolylineOn(state),
    tasksEntities: selectTasksEntities(state),
  };
}

export default connect(mapStateToProps)(withTranslation()(TasksMapView));
