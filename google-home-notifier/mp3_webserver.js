const path = process.argv[2];
const dataServerPort = process.env.MP3_SERVER_PORT;
console.log(process.argv);

var express = require('express');
var app = express();

app.get('/*.mp3', function(req, res) {
  console.log(req.query);
  const file = path + req.url;
  console.log(file);
  res.download(file); // Set disposition and send it.
});

console.log("boot mp3 server with port no. " +  dataServerPort);
console.log(process.env);

app.listen(dataServerPort);


