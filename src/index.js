const express = require("express");
const app = express();

var metrics = {};

app.get("/", function(req, res) {
  res.send("Prometheus Metrics Gateway");
});

app.get("/v1/counter/:metric/inc", function(req, res) {
  let key = {
    metric: req.params.metric
  };
  for (var propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
      key[propName] = req.query[propName];
    }
  }
  let keyString = JSON.stringify(key);
  if (metrics[keyString] !== undefined) {
    metrics[keyString]++;
    if (metrics[keyString] < 0) {
      metrics[keyString] = 1;
    }
  } else {
    metrics[keyString] = 1;
  }
  res.send(metrics);
});

// TODO: reponse for prometheus

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
