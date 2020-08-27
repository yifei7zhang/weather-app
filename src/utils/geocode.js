const request = require("request");
const dotenv = require('dotenv').config();

const mapBoxKey = process.env.MAPBOXKEY;

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${mapBoxKey}`;
  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback(error, undefined);
    } else if (body.features.length === 0) {
      callback("Unable to find location; please try another search", undefined);
    } else {
      const data = body.features[0];
      callback(undefined, {
        latitude: data.center[1],
        longitude: data.center[0],
        location: data.place_name,
      });
    }
  });
};

module.exports = geocode;
