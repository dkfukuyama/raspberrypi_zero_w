var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var mdns = require('mdns');
var browser = mdns.createBrowser(mdns.tcp('googlecast'));
var deviceAddress;
var language;

var device = function(name, lang = 'en') {
    device = name;
    language = lang;
    return this;
};

var ip = function(ip, lang = 'en') {
  deviceAddress = ip;
  language = lang;
  return this;
}

var googletts = require('google-tts-api');
var googlettsaccent = 'us';
var accent = function(accent) {
  googlettsaccent = accent;
  return this;
}

async function GetGoogleHomeAddress(){
    return new Promise((resolve, reject) => {
      if (!deviceAddress){
        browser.start();
        browser.on('serviceUp', function(service) {
          console.log('Device "%s" at %s:%d', service.name, service.addresses[0], service.port);
          if (service.name.includes(device.replace(' ', '-'))){
            deviceAddress = service.addresses[0];
            resolve();
          }
          browser.stop();
        });
      }else{
        console.log('Device "%s" (already resolved)', device);
        resolve();
      }
    });
}

var notify = async function(message, callback, promise_resolve) {
    await GetGoogleHomeAddress();
    getSpeechUrl(message, deviceAddress, function(res, d) {
      callback(res, d);
      promise_resolve();
    });

}

var play = async function(mp3_url, callback, promise_resolve) {
  await GetGoogleHomeAddress();
  getPlayUrl(mp3_url, deviceAddress, function(res, d) {
    callback(res, d);
    promise_resolve();
  });
};

var getSpeechUrl = function(text, host, callback) {
  googletts(text, language, 1, 1000, googlettsaccent).then(function (url) {
    onDeviceUp(host, url, function(res, d){
      console.log(url);
      callback(res, d)
    });
  }).catch(function (err) {
    console.error(err.stack);
  });
};

var getPlayUrl = function(url, host, callback) {
    //console.log(url);
    onDeviceUp(host, url, function(res, d){
      callback(res, d)
    });
};

var g_status = "NONE";
const STAT_PLAYING = "PLAYING";
const STAT_IDLE = "IDLE";
const STAT_PAUSED = "PAUSED";

var onDeviceUp = function(host, url, callback) {
  var client = new Client();
  client.connect(host, function() {
    client.launch(DefaultMediaReceiver, function(err, player) {

      var media = {
        contentId: url,
        contentType: 'audio/mp3',
        streamType: 'BUFFERED' // or LIVE
        //streamType: 'LIVE' // or BUFFERED
      };

      player.load(media, { autoplay: true}, function(err, status) {
        if(status.hasOwnProperty('playerState')){
          console.log('media loaded playerState=%s', status.playerState);
          if(status.playerState == STAT_PLAYING){
            g_status = STAT_PLAYING;
          }
        }else{
          console.log('media loaded playerState=%s', "unexisted");
        }
      
      });
      player.on('status', function(status) {
        console.log('status broadcast playerState=%s', status.playerState);

        if(g_status == STAT_PLAYING && status.playerState == STAT_IDLE){
          g_status = STAT_IDLE;
          client.close();
          callback('close');
        }else if(status.playerState == STAT_PAUSED){
          client.close();
          callback('PAUSED close');
        }else if(g_status == STAT_PLAYING && status.playerState == STAT_PLAYING){
          if(status.hasOwnProperty('media') && status.media.hasOwnProperty('duration')){
            let d = status.media.duration * 1000 + 1000;
            console.log(d);
            setTimeout(()=>{
              try{
                client.close();
              }catch{}
              finally{
                callback('TIME OUT close');
              }
            }, d);
          }
        }

      });
    });
  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
    callback('error');
  });
};

exports.ip = ip;
exports.device = device;
exports.accent = accent;
exports.notify = notify;
exports.play = play;
