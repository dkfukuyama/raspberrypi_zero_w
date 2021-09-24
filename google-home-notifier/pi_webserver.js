const path = process.argv[2];

const { exec } = require('child_process');
//const { Console } = require('console');
//const { waitForDebugger } = require('inspector');

var svr_prt = 0;

async function get_port_number(){
  return new Promise((resolve, reject) => {
    if(process.env.HOMEDRIVE != 'C:'){
      exec("cat /etc/sysconfig/pi", (err, stdout, stderr) => {
        svr_prt=stdout.trim().replace('MP3_SERVER_PORT=','');
        //console.log(svr_prt);
        resolve();
      });
    }else{
      svr_prt=8091;
      resolve();
    }
  });
}


function sleep(waitSec) {
  return new Promise(function (resolve) {
      setTimeout(function() { resolve() }, waitSec);
  });
} 

async function main(){
  await get_port_number();
  const dataServerPort = svr_prt;

  console.log(process.argv);

  let current_path = process.cwd() + '/';

  var express = require('express');
  var app = express();

  const bodyParser = require('body-parser');
  // body-parser
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static('public'))

  app.set('view engine', 'pug')

  app.get('/', function(req, res) {
   res.sendFile(current_path + 'html/index.html');
  });
  
  app.get('/speech/:phrase', function(req, res) {
    //const { exec } = require('child_process');
    exec('node /home/pi/google-home-notifier/go.js tts@' + req.params.phrase + '@', (error, stdout, stderr)=> {
      console.log(stdout);
      console.log(error);
    });
    res.render('index', { title: req.params.phrase, message: req.params.phrase});
  });

  app.get('/speech_post/', function(req, res) {
    res.sendFile(current_path + 'html/speech_post/index.html');
  });

  app.post('/speech_post/', function(req, res) {
    console.log(req.body.speech_content);
    exec('node /home/pi/google-home-notifier/go.js tts@' + req.body.speech_content + '@', (error, stdout, stderr)=> {
      console.log(stdout);
      console.log(error);
    });
    res.sendFile(current_path + 'html/speech_post/index.html');
  });

  app.get('/make_quiz/', function(req, res) {
    res.render('index', { title: 'まだできていないよ', message: 'まだできていないよ'});
  });

  app.get('/show_music_list/', function(req, res) {
    let musicList = require('./select_music').showMusicList();
    res.render('m_list', { title: '音楽の一覧', message: '音楽の一覧（おんがくのいちらん）', mlist : musicList});
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

