// socket.io reference :  https://socket.io/docs/v4/index.html


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


const { application } = require('express');
const io = require('socket.io-client');

async function CommandBase(setmode, str){
    const socket = io("ws://localhost:8191");
    socket.on("connect", () => {
    // either with send()
    // socket.send("Hello! from Client");
    // or with emit() and custom event names
    socket.emit("Command", setmode, str, true);
    });

    const timeoutid = setTimeout(()=>{
        socket.close();
    },1000);

    // handle the event sent with socket.emit()
    socket.on("CommandAck", (mode, results, message) => {
        console.log("CommandAck OK!");
        console.log("mode : " + mode);
        console.log("results : " + results);
        console.log("message : " + message);
        clearTimeout(timeoutid);
        socket.close();
    });
    while(socket.connected){await sleep(0.1);}
}

const Add = (str)=>CommandBase("Add", str);
const AllClear = (str)=>CommandBase("AllClear", str);

function main_func(){
    Add("123355");
    Add("XXXXXXX");
    Add("BBBBB");
}

main_func();
