// -------------------------------------------------------------------------------
// was
// -------------------------------------------------------------------------------
const express = require("express")
const { WebSocketServer } = require("ws")
const app = express()

app.use(express.static("./"))

app.listen(8080, () => {
	console.log(`was listening on port 8080`)
})

const wss = new WebSocketServer({ port: 8001 })

wss.broadcast = (message) => {
	wss.clients.forEach((user) => {
		user.send(message);
	});
};

wss.on("connection", (ws, request) => {
	ws.on("message", (data) => {
		const sendbuff = send_packet('T', 'sbo_001_001', data.toString());
		client.write(sendbuff);
console.log("send=" + data.toString());
	});

	ws.on("close", () => {
		//const sendbuff = send_packet('T', 'sbo_logout', "");
		//client.write(sendbuff);
		wss.broadcast(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
		client.destroy(); // kill client after server's response
	});

	wss.broadcast(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`);

	// -------------------------------------------------------------------------------
	// platform
	// -------------------------------------------------------------------------------
	const net = require('net');
	const STX = 0xfe;

	const client = new net.Socket();
	client.connect(16811, '127.0.0.1', function() {
		console.log('Connected');
		//const sendbuff = send_packet('T', 'sbo_login', "");
		//client.write(sendbuff);
	});

	client.on('data', function(data) {
		recv_packet(ws, client, data);
	});

	client.on('close', function() {
		console.log('Connection closed');
	});
	// -------------------------------------------------------------------------------
})

// -------------------------------------------------------------------------------
// recv_packet()
// -------------------------------------------------------------------------------
function recv_packet(ws, client, data) {
	const STX = 0xfe;
	var buff = "";

//console.log('recv_packet data.length : ' + data.length);
	for (var ii=0; ii < data.length; ) {
		buff = "";

		if (data[ii] != STX && data[ii+1] != STX && data[ii+2] != STX && data[ii+3] != STX) {
			return;
		}
		buff += data[ii];
		buff += data[ii+1];
		buff += data[ii+2];
		buff += data[ii+3];
		ii += 4;	/* STX size	*/

		if (String.fromCharCode(data[ii]) == 'P') {
			ii += 1;	/* type length size */
			ii += 12;	/* trnm length size */
			ii += 5;	/* data length size */
			const sendbuff = send_packet('P', '', '');
			client.write(sendbuff);
		}
		else if (String.fromCharCode(data[ii]) == 'T') {
			ii += 1;	/* type length size */
			ii += 12;	/* trnm length size */

			var dlen = data.slice(ii, ii+5);
			ii += 5;	/* data length size */
//console.log('dlen : ' + dlen);

			var sumlen = Number(ii) + Number(dlen);
//console.log('ii+dlen : ' + sumlen);
			var text = data.slice(ii, sumlen);
//console.log('text : ' + text);
			var text2 = "";
			var unicode = 0;

//console.log('text length: ' + text.length);
			for(var jj=0; jj<text.length; ) {
				unicode = (text[jj] * 255) + text[jj] + text[jj + 1];
				text2 = text2 + String.fromCharCode(unicode);
				jj += 2;
			}
			ii = sumlen;
//console.log('ii : ' + ii);

console.log("recv=" + text2);
			ws.send(text2);
//console.log('Received: ' + text2);
		}
	}
}

// -------------------------------------------------------------------------------
// sned_packet()
// -------------------------------------------------------------------------------
function send_packet(type, trnm, data) {
	const STX = 0xfe;
	const datalen = data.length*2;
	const header = type + trnm.padEnd(12, " ") + String(datalen).padStart(5, "0");

/*
if (type == 'T')
console.log('snd data length : ' + dataLen);
*/

	var tmpb = new ArrayBuffer(22 + datalen);
	var sndb = new Uint8Array(tmpb);
	var unicode = 0;
	var index = 4;

	sndb[0] = sndb[1] = sndb[2] = sndb[3] = 0xfe;
	for (var ii=0, strLen=header.length; ii < strLen; ii++) {
		sndb[index] = header.charCodeAt(ii);
		index++;
	}


/*
if (type == 'T')
console.log('escape: ' + escape(message.charAt(ii)).length);
*/

	for (var ii=0, strLen=data.length; ii < strLen; ii++) {
		unicode = data.charCodeAt(ii);
		sndb[index] = unicode >>> 8;
		index++;
		sndb[index] = unicode & 0xff;
		index++;
	}

/*
if (type == 'T')
console.log('Send: ' + sndb);
*/
	return sndb;
};
