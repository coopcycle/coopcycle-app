import Polyline from '@mapbox/polyline';

class DirectionsAPI {

  constructor(client) {
    this.client = client;
  }

  getRoute(coordinates) {

    const values = coordinates.map(coordinate => [ coordinate.latitude, coordinate.longitude ].join(','))
    const coordinatesToString = values.join(';')
    var uri = `/api/routing/route/${coordinatesToString}`

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