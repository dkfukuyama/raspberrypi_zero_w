// socket.io reference :  https://socket.io/docs/v4/index.html
const Queue = require('queue-fifo');
const queue = new Queue();


const io = require("socket.io")(8191);

io.on("connection", socket => {
  // either with send()
  socket.send("Hello! from Server");

  // handle the event sent with socket.emit()
  socket.on("Command", (mode, message, AckRequired) => {
    console.log(mode, message, AckRequired);

    switch(mode){
        case "Add":
            queue.enqueue(message);
            break;
        case "AllClear":
            queue.clear();
            break;
        default:
            console.log("mode \"%s\" is invalid", mode);
    }

    if(AckRequired){
        socket.emit("CommandAck", mode, "OK!", "none");
    }
    console.log("--end---");
  });

    socket.on('end', function (){
        socket.disconnect(0);
    });
});

setInterval(() => {
    if(queue.size()>0){
        console.log(queue.dequeue());
    }else{
        console.log('queue is empty');
    }
}, 2000);
