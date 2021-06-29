

console.log(process.argv);

const split_str = "@";
const split_str_cal = "___";
const input = process.argv[2];

const { exec } = require('child_process');

var svr_prt = 0;
/*
exec("cat /etc/sysconfig/pi", (err, stdout, stderr) => {
    svr_prt=stdout.trim().replace('MP3_SERVER_PORT=','');
    console.log(svr_prt);
});
*/
svr_prt = 8091;

const googlehome = require('./google-home-notifier');
const language = 'ja'; // ここに日本語を表す ja を設定

googlehome.ip(undefined, language);
googlehome.device('Google Nest', language);

let ip;
/*
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
*/
ip = "192.168.1.45";

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
    return new Promise(async (resolve, reject)=>{
        for(;;){
            console.log("--- start main_func");
            await notify("あいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえお" , function(res) {
                console.log(res); 
            });
            console.log("--- exit main_func");
        }
        resolve();
    });
}

main_func();
