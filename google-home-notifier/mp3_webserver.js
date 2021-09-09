const path = process.argv[2];
#const dataServerPort = process.env.MP3_SERVER_PORT;
const dataServerPort = 8091;

console.log(process.argv);

var express = require('express');
var app = express();

app.get('/speech/:phrase', function(req, res) {
  const { exec } = require('child_process');
  exec('node /home/pi/google-home-notifier/go.js tts@' + req.params.phrase + '@', (error, stdout, stderr)=> {
    console.log(stdout);
    console.log(error);
  });
  res.render('index', { title: req.params.phrase});
});

app.get('/*.mp3', function(req, res) {
  console.log(req.query);
  const file = path + req.url;
  console.log(file);
  res.download(file); // Set disposition and send it.
});

console.log("boot mp3 server with port no. " +  dataServerPort);
console.log(process.env);

app.listen(dataServerPort);


