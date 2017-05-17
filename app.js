var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var serialPort = require('serialport');

serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});


var portName = "COM3";

var port = new serialPort(portName, {
  baudRate:9600,
  parser: serialPort.parsers.readline('\n'),
});


app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req,res,next){
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('messages', function(data) {
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });

    port.on('data', function (data) {
      client.emit('broad', data);
      client.broadcast.emit('broad',data);
    });
});

server.listen(4200);
