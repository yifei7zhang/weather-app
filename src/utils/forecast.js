const request = require("request");
const dotenv = require('dotenv').config();

const darkSkyKey = process.env.DARKSKYKEY;

const forecast = (longitude, latitude, callback) => {
  const url = `https://api.darksky.net/forecast/${darkSkyKey}/${latitude},${longitude}?units=si`;
  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback(error, undefined);
    } else if (body.error) {
      callback("Unable to find location; please try another search", undefined);
    } else {
      const currentData = body.currently;
      const dailyData = body.daily.data[0];
      const responseString = `${dailyData.summary}\nIt is currently ${currentData.temperature} degrees out, and feels like ${currentData.apparentTemperature}. There is a ${currentData.precipProbability}% chance of rain.`;
      callback(undefined, responseString);
    }
  });
};

module.exports = forecast;
