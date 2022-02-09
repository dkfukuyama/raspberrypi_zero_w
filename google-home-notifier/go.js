console.log(process.argv);

const split_str = "@";
const split_str_cal = "___";
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
        exec("node /home/pi/google-home-notifier/getip.js", (err, stdout, stderr) => {
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

    console.log("MESSAGE ::: " + message);

    var duration = 0;
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

        var media_data;

        // mp3再生前に読み上げる所定の文字列
        await notify(playFileObj.comment, function(res, d) { console.log(res); duration = d.media.duration; });
        await Promise.all([gip, sleep(duration, null)]);
        // 変数ipには自分のIPアドレスが入る。
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
        await sleep(duration + 5, null);
        console.log('process.exit(0);');
        process.exit(0);
    }else if(mode == "tts"){ // テキスト読み上げモードのとき
        console.log("text to speech mode");

        await notify(message , function(res, d) { console.log(res); duration = d.media.duration; });
        console.log("duration = " + duration);
        await sleep(duration + 5, null);
        console.log('process.exit(0);');
        process.exit(0);
    }else if(mode == "cal"){ // カレンダーモードのとき
        console.log("calendar mode");

        const splitted_cal = message.split(split_str_cal);

        console.log("splitted_cal :: ");
        console.log(splitted_cal);


        let speak_contents = "";
        let regexresults = undefined;
        let regexresults2 = undefined;

        if(splitted_cal[1].match(/(Calendar)(.*)(updated)/i)){
            speak_contents += "予定の更新をお知らせします。。。";
        }else if(splitted_cal[1].startsWith("New calendar event created")){
            speak_contents += "新しい予定が登録されました。。。";
        }else if(splitted_cal[1].startsWith("Calendar event was cancelled")){
            speak_contents += "予定の取り消しをお知らせします。。。";
        }else if(regexresults = splitted_cal[1].match(/Event starting in (\d+?) minutes:/i)){
            speak_contents += "予定の開始は" + regexresults[1] + "分後。。。"
        }

        speak_contents += "予定の内容は。。" + splitted_cal[2] + "。。。";

        console.log(speak_contents);

        let time_str = splitted_cal[0].split(splitted_cal[2] + ": ")[1];

        console.log("time_str : " + time_str);
        regexresults2 = time_str.match(/<\!date\^(\d*?)\^.*?\|.*?>/i);
        var dt = new Date(parseInt(regexresults2[1],0) * 1000);
        dt.setHours(dt.getHours() + 9);

        speak_contents += "開始日時は。" + (dt.getMonth()+1) + "月" + dt.getDate() + "日" + dt.getHours() + "時" + dt.getMinutes() + "分";
        console.log(speak_contents);
        await notify(speak_contents, function(res, d) { console.log(res); duration = d.media.duration; });
        console.log("duration = " + duration);
        await gip;
        await sleep(duration + 5, null);
        console.log('process.exit(0);');
        process.exit(0);
    }else if(mode == "sys"){ // システムモードのとき
        const { exec } = require('child_process');
        exec(message, (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            console.log(err);
            process.exit(0);
        });
    }
}

main_func();
