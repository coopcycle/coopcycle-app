import Polyline from 'polyline';

class DirectionsAPI {

  constructor(client) {
    this.client = client;
  }

  getRoute(opts) {
    var origin = opts.origin;
    var destination = opts.destination;
    var uri = '/api/routing/route?';
        uri += 'origin=' + origin.latitude + ',' + origin.longitude;
        uri += '&destination=' + destination.latitude + ',' + destination.longitude;

    // if (opts.waypoints) {
    //   url += '&waypoints=' + opts.waypoints.latitude + ',' + opts.waypoints.longitude;
    // }

    return this.client.get(uri)
      .then((data) => {
        return DirectionsAPI.toPolylineCoordinates(data.routes[0].geometry);
      })
  }

  static toPolylineCoordinates(polyline) {
    let steps = Polyline.decode(polyline);
    let polylineCoords = [];

    for (let i = 0; i < steps.length; i++) {
      let tempLocation = {
        latitude : steps[i][0],
        longitude : steps[i][1]
      }
      polylineCoords.push(tempLocation);
    }

    return polylineCoords;
  }
}

module.exports = DirectionsAPI;