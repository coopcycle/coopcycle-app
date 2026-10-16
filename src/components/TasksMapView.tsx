import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import objectHash from 'object-hash';

import TaskMarker from './TaskMarker';
import { filterTasks } from '../redux/logistics/utils';
import { getTaskListTasks } from '../shared/src/logistics/redux/taskListUtils';
import {
  selectIsHideUnassignedFromMap,
  selectIsPolylineOn,
} from '../redux/Courier';
import { selectTasksEntities } from '../shared/logistics/redux';

import {
  BottomSheetContext,
} from '@/components/ui/bottomsheet';
import TasksBottomSheetContent from './TasksBottomSheetContent';
import TaskListPolylines from './TaskListPolylines';

function TasksMapView(props) {
  const {
    mapCenter,
    onMapReady,
    onListedTaskPress,
    taskLists = [],
    uiFilters,
    tasksEntities,
    isHideUnassignedFromMap,
  } = props;

  const [marginBottom, setMarginBottom] = useState(1);
  const mapRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(0);
  const [mapRegion, setMapRegion] = useState<Region>();
  const [hasBeenReady, setHasBeenReady] = useState(false);

  // Only ever latch a non-zero height. An inactive tab is hidden with
  // `display: none` (react-native-screens does that for every screen when the
  // navigator keeps inactive screens attached), and a hidden view lays out at
  // zero height — which used to unmount the native map on every tab switch,
  // dropping the markers and replaying the map's loading state on the way back.
  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0) {
      setMapHeight(height);
    }
  }, []);

  const showPolylines = useSelector(selectIsPolylineOn)

  // A tab screen holding a map is hidden rather than unmounted when it loses
  // focus (`detachInactiveScreens={false}`, see CourierNavigator and #2113).
  // The native map drops its annotations while hidden, and React has no reason
  // to put them back: the marker elements never changed, so nothing is
  // re-inserted and the map comes back empty. Bumping a token on every focus
  // re-creates everything drawn on the map — without re-creating the map
  // itself, so the camera and the loaded tiles are kept.
  const isFocused = useIsFocused();
  const [focusToken, setFocusToken] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setFocusToken(token => token + 1);
    }
  }, [isFocused]);

  //bottomsheet opening
  const { handleOpen } = useContext(BottomSheetContext || {});
  const [modalMarkers, setModalMarkers] = useState([]);

  const onMarkerPress = useCallback(
    (tasksAtLocation) => {
      setModalMarkers(tasksAtLocation);
      if (handleOpen) handleOpen();
    },
    [handleOpen]
  );

  const onRegionChangeComplete = useCallback((region: Region) => {
    setMapRegion(region);
  }, []);

  // filtered data
  const data = useMemo(() => {
    return _.flatMap(taskLists, (taskList) => {
      if (isHideUnassignedFromMap && taskList.isUnassignedTaskList)
        return [];
      const tasks = getTaskListTasks(taskList, tasksEntities);
      const filtered = !_.isEmpty(uiFilters) ? filterTasks(tasks, uiFilters) : tasks;

      return filtered.map((task) => ({
        ...task,
        location: task.address.geo,
        taskList,
      }));
    });
  }, [taskLists, tasksEntities, uiFilters, isHideUnassignedFromMap]);

  const groupedByCoord = useMemo(() => {
    return _.groupBy(data, (task) => {
      const { latitude, longitude } = task.address.geo;
      return `${latitude.toFixed(5)}_${longitude.toFixed(5)}`;
    });
  }, [data]);

  //markers render
  const renderMarkers = useMemo(() => {
    return Object.values(groupedByCoord).map((tasks) => {
      const ids = tasks.map(t => t.id).sort((a, b) => a - b);
      const key = `taskmarker-${ids.join(',')}`;
      const firstTask = tasks[0];
      const { latitude, longitude } = firstTask.address.geo;

      return (
        <Marker
          key={key}
          coordinate={{ latitude, longitude }}
          onPress={() => onMarkerPress(tasks)}
          tracksViewChanges={false}
        >
          <TaskMarker
            task={firstTask}
            count={tasks.length}
            testID={key}
          />
        </Marker>
      );
    });
  }, [groupedByCoord, onMarkerPress]);
  ;

  const mapKey = useMemo(() => {
    return objectHash({
      ...uiFilters,
      showPolylines
    })
  }, [uiFilters, showPolylines]);

  // render bottomsheet
  const renderBottomSheet = useCallback(() => {
    if (!modalMarkers || modalMarkers.length === 0) return null;
    return (
      <TasksBottomSheetContent
        modalMarkers={modalMarkers}
        onListedTaskPress={onListedTaskPress}
      />
    ); },[modalMarkers, onListedTaskPress]);

  // map render
  return (
    <>
      <View
        renderToHardwareTextureAndroid={true}
        collapsable={false}
        style={{ flex: 1 }}
        onLayout={onContainerLayout}
      >
        {mapHeight > 0 && (
          <MapView
            // https://github.com/react-native-maps/react-native-maps/issues/5840
            // https://github.com/react-native-maps/react-native-maps/issues/5669
            // https://github.com/react-native-maps/react-native-maps/issues/5798
            // We use a key prop to force the map to re-render, and cleanup markers/polylines.
            key={mapKey}
            onRegionChangeComplete={onRegionChangeComplete}
            ref={mapRef}
            style={{ flex: 1, marginBottom }}
            initialRegion={mapRegion || {
              latitude: mapCenter[0],
              longitude: mapCenter[1],
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onMapReady={() => {
              setMarginBottom(0);
              setHasBeenReady(true);
              if (onMapReady) onMapReady();
            }}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            // Only while the map has never been ready. The native map resets
            // its rendering when the screen is hidden, and leaving this on
            // flashed the loading view over an already-loaded map on every tab
            // switch.
            loadingEnabled={!hasBeenReady}
          >
            {/* Keyed on the focus token so everything drawn on the map is
                re-created when the screen comes back — see `focusToken`. */}
            <React.Fragment key={focusToken}>
              <TaskListPolylines
                taskLists={taskLists}
              />
              {renderMarkers}
            </React.Fragment>
          </MapView>
        )}
      </View>
      {renderBottomSheet()}
    </>
  );
}

function mapStateToProps(state) {
  return {
    isHideUnassignedFromMap: selectIsHideUnassignedFromMap(state),
    tasksEntities: selectTasksEntities(state),
  };
}

export default connect(mapStateToProps)(withTranslation()(TasksMapView));
