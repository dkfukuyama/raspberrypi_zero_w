console.log(process.argv);

const split_str = "@";

const input = process.argv[2];

const { exec } = require('child_process');

var svr_prt = 0;
exec("cat /etc/sysconfig/pi", (err, stdout, stderr) => {
    svr_prt=stdout.trim().replace('MP3_SERVER_PORT=','');
    console.log(svr_prt);
});

const googlehome = require('./google-home-notifier');
const language = 'ja'; // ここに日本語を表す ja を設定

googlehome.ip(undefined, language);
googlehome.device('Google Nest', language);

let ip;
async function get_ip(){
    return new Promise((resolve, reject) => {
        // 自分のIPアドレスを取得するためのlinuxコマンドを呼び出す。
        ip = "0.0.0.0";
        exec("ip -4 a show wlan0 | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'", (err, stdout, stderr) => {
            ip=stdout.trim();
            console.log(ip);
            resolve();
        });
    });
}

// 指定時間、非同期で待機する関数
async function sleep(waitSec, callbackFunc) {
    return new Promise((resolve, reject) => {
    
        var spanedSec = 0;
        var waitFunc = function () {
    
            spanedSec+=0.1;
    
            if (spanedSec >= waitSec) {
                if (callbackFunc) callbackFunc();
                resolve();
               
            }
            clearTimeout(id);
            id = setTimeout(waitFunc, 100);
        };
        var id = setTimeout(waitFunc, 100);
    });
}

// google-home-notifierのnotify関数を非同期実行
async function notify(str, callback){
    return new Promise((resolve, reject)=>{
        googlehome.notify(str, callback, resolve);
    });
}

// google-home-notifierのplay関数を非同期実行
async function play(str, callback){
    return new Promise((resolve, reject)=>{
        googlehome.play(str, callback, resolve);
    });
}

// メイン関数 非同期実行
async function main_func(){

    let gip = get_ip();
    // param-1@param-2@param-3の取得
    const splitted_input = input.split(split_str);

    // param-1@param-2@param-3を所定の区切り文字で分割
    const mode = splitted_input[0];
    const message = splitted_input[1];
    const options = splitted_input[2];

    if(mode == "music"){ // 音楽再生モードのとき
        console.log("play music mode");

        // messageに関連するmp3ファイルを読み出す。
        var playFileObj = require('./select_music').selectMusicFile(message.replace(/\s/g, ''));
        console.log(playFileObj);

        
        if(playFileObj.filename == null){
            await notify("みんなのおんがくにしっぱいしました。「　" + message + "　」。 なんて曲はないよ" , function(res, d) { console.log(res); duration = d.media.duration; });
            await sleep(duration, null);
            console.log('process.exit(0);');
            process.exit(0);
        }
        

        var duration = 0;
        var media_data;

        // mp3再生前に読み上げる所定の文字列
        await notify(playFileObj.comment, function(res, d) { console.log(res); duration = d.media.duration; });
        await Promise.all([gip, sleep(duration, null)]);
        // 変数ipには自分のIPアドレスが入る。
        // 厳密には、IPアドレス取得完了を待ってから変数を使用しなければならない。
        // 前段のnotify関数のawaitで並列でipアドレス取得が十分に間に合うので一旦この方式で進める。
	const dataServerAddress = ip;
	const dataServerPort = svr_prt;

        // 再生するmp3ファイルのURLを設定する。
        var reqStr = 'http://' + dataServerAddress  + ':' + dataServerPort + '/' + playFileObj.filename;
        console.log(reqStr);

        // 指定したmp3ファイルをgoogle homeから再生する命令。
        await play(reqStr, function(res, d) { 
            console.log(res);
            if(d != null){
                media_data = d;
                duration = d.media.duration;
                console.log(d);
            }
        });
        await sleep(duration, null);
        console.log('process.exit(0);');
        process.exit(0);
    }else if(mode == "tts"){ // テキスト読み上げモードのとき
        console.log("text to speech mode");

        await notify(message , function(res, d) { console.log(res); duration = d.media.duration; });
        await sleep(duration, null);
        console.log('process.exit(0);');
        process.exit(0);
    }else if(mode == "cal"){
        console.log("calendar mode");

        await notify(message , function(res, d) { console.log(res); duration = d.media.duration; });
        await sleep(duration, null);
        console.log('process.exit(0);');
        process.exit(0);
        
    }
}

main_func();
setTimeout(() => {
    console.log('process.exit(1);');
    process.exit(1);
}, 30000);
