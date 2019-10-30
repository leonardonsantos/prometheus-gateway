const express = require("express");
const app = express();

var metrics = {};

app.get("/", function(req, res) {
  res.send("Prometheus Metrics Gateway");
});

app.get("/v1/counter/inc", function(req, res) {
  for (var propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
      console.log(propName, req.query[propName]);
    }
  }
  res.send("Counter incremented");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
