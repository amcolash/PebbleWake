var express = require('express');
var wol = require('wake_on_lan');
require("console-stamp")(console, "mm/dd HH:MM:ss");

var app = express();

app.post('/wol', function(req, res) {
  if (req.headers.mac && req.headers.ip && req.headers.port) {
    console.log('Waking ' + req.headers.mac + ', at ' + req.headers.ip + ':' + req.headers.port);
    wol.wake(req.headers.mac, {address: req.headers.ip, port: req.headers.port}, function(error) {
      if (error) {
        // handle error
        res.status(500).send('Error waking');
      } else {
        // done sending packets
        res.status(200).send('Packet sent');
      }
    });

  } else {
    res.status(400).send('Invald request');
  }
});

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
