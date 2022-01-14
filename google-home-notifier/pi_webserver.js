const path = process.argv[2];

const { exec } = require('child_process');
const qf = require('./quiz_lib');

var svr_prt = 0;
var quiz_path = '';

async function get_port_number(){
  return new Promise((resolve, reject) => {
    if(process.env.HOMEDRIVE != 'C:'){
      exec("cat /etc/sysconfig/pi", (err, stdout, stderr) => {
        svr_prt=stdout.trim().replace('MP3_SERVER_PORT=','');
        quiz_path = path + '/quiz/';
        resolve();
      });
    }else{
      quiz_path = '//LANDISK-201129/disk1/music/quiz/';
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

  app.all('/speech_post/', function(req, res, next) {
    if(req.body.speech_content){
      console.log(req.body.speech_content);
      exec('node /home/pi/google-home-notifier/go.js tts@' + req.body.speech_content + '@', (error, stdout, stderr)=> {
        console.log(stdout);
        console.log(error);
      });
    }else{
      console.log('req.body.speech_content is empty')
    }
    res.sendFile(current_path + 'html/speech_post/index.html');
  });
  
  app.all('/show_music_list/', function(req, res) {
    let musicList = require('./select_music').showMusicList();
    res.render('m_list', { title: '音楽の一覧', message: '音楽の一覧（おんがくのいちらん）', mlist : musicList});
    if(req.body.mp3){
      exec('node /home/pi/google-home-notifier/go.js music@' + req.body.mp3 + '@', (error, stdout, stderr)=> {
        console.log(stdout);
        console.log(error);
      });
    }
  });

  app.all('/make_quiz/', function(req, res) {
    //console.log(req.body)
    if(!req.body.whois){
      if(req.body.mode == 'random_debug'){
        console.log('random_debug');
        let text = qf.randomDebug(quiz_path);

        if(process.env.HOMEDRIVE != 'C:'){
          exec('node /home/pi/google-home-notifier/go.js tts@' + text + '@', (error, stdout, stderr)=> {
            console.log(stdout);
            console.log(error);
          });
        }else{
          console.log(text);
        }

      }
      res.render('make_quiz_select_whois', { title: 'クイズの問題を作るよ。', message: 'もんだいをつくるのはだれですか？'});
    }else{
      if(req.body.mode == 'register'){
          console.log('問題を登録する');
          qf.registerNewFile(req.body, quiz_path)
      } else if (req.body.mode == 'delete') {
        console.log('delete mode');
        console.log(req.body.filename);
        qf.deleteFile(req.body.filename, quiz_path);
        
      }else if(req.body.mode == 'test_run1'){
        const text = qf.make_speech_text(req.body);

        if(process.env.HOMEDRIVE != 'C:'){
          exec('node /home/pi/google-home-notifier/go.js tts@' + text + '@', (error, stdout, stderr)=> {
            console.log(stdout);
            console.log(error);
          });
        }else{
          console.log(text);
        }
      }

      let result = qf.getExistingFileNamesToJsonString(req.body.whois, quiz_path);
      res.render('make_quiz', { title: 'クイズの問題を作るよ。', quiz:result, whois: req.body.whois});
    }
  });

  console.log("boot mp3 server with port no. " +  dataServerPort);
  app.listen(dataServerPort);
}

main();

