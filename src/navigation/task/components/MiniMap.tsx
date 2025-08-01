import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import TaskMarker from '../../../components/TaskMarker';
import { getRegionForTasks } from './mapUtils';

const zoomLevel = 15;

const MiniMap = ({ task, tasks, onLayout, aspectRatio }) => {
  // @see https://stackoverflow.com/questions/46568465/convert-a-region-latitudedelta-longitudedelta-into-an-approximate-zoomlevel/

  const region = getRegionForTasks(
    task ? [task] : tasks,
    zoomLevel,
    aspectRatio,
  );

  const renderPolyline = () => {
    const firstTask = tasks[0];
    const key = `polyline-${firstTask.id}`;
    const coords = tasks.map(t => t.address.geo);
    return (
      <Polyline
        key={key}
        testID={key}
        coordinates={coords}
        strokeWidth={3}
        strokeColor={firstTask.color}
        lineDashPattern={!firstTask.isAssigned ? [20, 10] : null}
      />
    );
  };

  return (
    <MapView
      style={styles.map}
      zoomEnabled
      showsUserLocation
      loadingEnabled
      loadingIndicatorColor={'#666666'}
      loadingBackgroundColor={'#eeeeee'}
      initialRegion={region}
      region={region}
      onLayout={onLayout}>
      {tasks.map(t => {
        return (
          <Marker
            identifier={t['@id']}
            key={t['@id']}
            coordinate={t.address.geo}
            flat={true}>
            <TaskMarker task={t} />
          </Marker>
        );
      })}
      {renderPolyline()}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MiniMap;
