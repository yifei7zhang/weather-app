const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 80;

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views llcation
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

// Serve (static) public content
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "weather app",
    name: "Yifei Zhang",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Yifei Zhang",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpMsg: "Enter in a location (city, zipcode, address, etc.) and get your weather forecast!",
    title: "Help",
    name: "Yifei Zhang",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }
  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        console.log("error: " + error);
        return res.send({ error });
      }
      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          console.log("error: " + error);
          return res.send({ error });
        }
        res.send({
          location,
          forecastData,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMsg: "Help article not found!",
    title: "Help 404",
    name: "Yifei Zhang",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    errorMsg: "404, Page not found!",
    title: "404",
    name: "Yifei Zhang",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
