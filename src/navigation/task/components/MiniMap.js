import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import TaskMarker from '../../../components/TaskMarker';
import { getRegionForTasks } from './mapUtils';

const zoomLevel = 15;

const MiniMap = ({ tasks, onLayout, aspectRatio }) => {
  // @see https://stackoverflow.com/questions/46568465/convert-a-region-latitudedelta-longitudedelta-into-an-approximate-zoomlevel/

  const region = getRegionForTasks(tasks, zoomLevel, aspectRatio);

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
      {tasks.map(task => {
        return (
          <Marker
            identifier={task['@id']}
            key={task['@id']}
            coordinate={task.address.geo}
            flat={true}>
            <TaskMarker task={task} />
          </Marker>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MiniMap;
