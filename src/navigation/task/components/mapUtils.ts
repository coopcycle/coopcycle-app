export const getRegionForTasks = (tasks, zoomLevel, aspectRatio = 1) => {
  if (!tasks || tasks.length === 0) return null;

  const lats = tasks.map(task => task.address.geo.latitude);
  const lngs = tasks.map(task => task.address.geo.longitude);

  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);

  const centerLat = (latMin + latMax) / 2;
  const centerLng = (lngMin + lngMax) / 2;

  const latRange = latMax - latMin;
  const lngRange = lngMax - lngMin;

  const baseDelta = Math.exp(Math.log(360) - zoomLevel * Math.LN2);

  const latitudeDelta = Math.max(baseDelta, latRange * 1.2);
  const longitudeDelta = Math.max(baseDelta * aspectRatio, lngRange * 1.2);

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta,
    longitudeDelta,
  };
};

export const getAspectRatio = mapDimensions => {
  let aspectRatio = 1;
  if (mapDimensions.height > 0) {
    aspectRatio = mapDimensions.width / mapDimensions.height;
  }
  return aspectRatio;
};
