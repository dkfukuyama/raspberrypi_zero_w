const path = process.argv[2];

const { exec } = require('child_process');

var svr_prt = 0;
async function get_ip(){
  return new Promise((resolve, reject) => {
    exec("cat /etc/sysconfig/pi", (err, stdout, stderr) => {
      svr_prt=stdout.trim().replace('MP3_SERVER_PORT=','');
      //console.log(svr_prt);
      resolve();
    });
  });
}

async function main(){
  await get_ip();
  const dataServerPort = svr_prt;

  console.log(process.argv);

  var express = require('express');
  var app = express();

  app.set('view engine', 'pug')

  app.get('/', function(req, res) {
    res.render('index',  { title: 'Raepbsrrypi web server', message: 'Hello there!' });
  });
  
  app.get('/speech/:phrase', function(req, res) {
    //const { exec } = require('child_process');
    exec('node /home/pi/google-home-notifier/go.js tts@' + req.params.phrase + '@', (error, stdout, stderr)=> {
      console.log(stdout);
      console.log(error);
    });
    res.render('index', { title: req.params.phrase, message: req.params.phrase});
  });

  app.get('/*.mp3', function(req, res) {
    console.log(req.query);
    const file = path + req.url;
    console.log(file);
    res.download(file); // Set disposition and send it.
  });
  
  console.log("boot mp3 server with port no. " +  dataServerPort);

  app.listen(dataServerPort);
}

main();
