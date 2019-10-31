const express = require("express");
const app = express();

var metrics = {};

app.get("/", function(req, res) {
  res.send("Prometheus Metrics Gateway");
});

app.get("/v1/counter/:metric/inc", function(req, res) {
  let key = {
    metric: req.params.metric,
    tags: {}
  };
  for (let propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
      key.tags[propName] = req.query[propName];
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
  res.send({ success: true });
});

app.get("/v1/metrics/prometheus", function(req, res) {
  // do not repeat same metrics
  let uniqueMetrics = {};
  for (let keyString in metrics) {
    let key = JSON.parse(keyString);

    uniqueMetrics[key.metric] = 1;
  }

  let resultString = "";

  for (let metric in uniqueMetrics) {
    resultString += "# TYPE " + metric + " counter\n";
  }

  resultString += "\n";

  // values for each tag set
  for (let keyString in metrics) {
    let key = JSON.parse(keyString);

    let tags = [];
    for (let tag in key.tags) {
      tags.push("" + tag + "=" + key.tags[tag]);
    }
    let tagsString = tags.join(",");

    resultString +=
      "" + key.metric + "{" + tagsString + "} " + metrics[keyString] + "\n";
  }

  res.type("text/plain");
  res.send(resultString);
});

app.listen(8080, function() {
  console.log("App listening on port 8080!");
});
