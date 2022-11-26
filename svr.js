var net = require('net');

var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);

	socket.setEncoding(encoding=null);

	socket.on('data', function(data){
		console.log('rcv:' + data);
		console.log(data.length);
	});

	socket.on('close', function(){
		console.log('client disconnted.');
	});
});

server.listen(16811, '127.0.0.1');
