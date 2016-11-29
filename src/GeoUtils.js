import _ from 'underscore';

class GeoUtils {
  static parsePoint(text) {
    var matches = text.match(/POINT\(([0-9.]+) ([0-9.]+)\)/i);
    var latitude = parseFloat(matches[1]);
    var longitude = parseFloat(matches[2]);
    return {
      latitude: latitude,
      longitude: longitude
    }
  }
}

module.exports = GeoUtils;