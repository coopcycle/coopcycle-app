import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import TaskMarker from '../../../components/TaskMarker';

const zoomLevel = 15;

const MiniMap = ({ task, onLayout, aspectRatio }) => {
  // @see https://stackoverflow.com/questions/46568465/convert-a-region-latitudedelta-longitudedelta-into-an-approximate-zoomlevel/
  const distanceDelta = Math.exp(Math.log(360) - zoomLevel * Math.LN2);

  const region = {
    latitude: task.address.geo.latitude,
    longitude: task.address.geo.longitude,
    latitudeDelta: distanceDelta,
    longitudeDelta: distanceDelta * aspectRatio,
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
      <Marker
        identifier={task['@id']}
        key={task['@id']}
        coordinate={task.address.geo}
        flat={true}>
        <TaskMarker task={task} />
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MiniMap;
