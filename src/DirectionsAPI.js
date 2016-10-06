import _ from 'underscore';
import Polyline from 'polyline';

const GOOGLE_API_KEY = 'AIzaSyCAqNf8X0elLLXv5yeh0btsYpq47eCzIAw';

class DirectionsAPI {
  static getDirections(opts) {
    var origin = opts.origin;
    var destination = opts.destination;
    var url = 'https://maps.googleapis.com/maps/api/directions/json?mode=bicycling';
        url += '&origin=' + origin.latitude + ',' + origin.longitude;
        url += '&destination=' + destination.latitude + ',' + destination.longitude;
        url += '&key=' + GOOGLE_API_KEY;

    if (opts.waypoints) {
      url += '&waypoints=' + opts.waypoints.latitude + ',' + opts.waypoints.longitude;
    }

    return fetch(url)
      .then((response) => {
        return response.json();
      });
  }
  static toPolylineCoordinates(data) {
    let points = data.routes[0].overview_polyline.points;
    let steps = Polyline.decode(points);
    let polylineCoords = [];

    for (let i=0; i < steps.length; i++) {
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