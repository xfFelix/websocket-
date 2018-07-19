var ws = require("nodejs-websocket");

var PORT = 4000;

var clientCount = 0;
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++;
	conn.nickName = 'user' + clientCount;
	var msg = {};
	msg.type = 'enter';
	msg.data = conn.nickName + 'come in';
	broadcast(JSON.stringify(msg));
	conn.on("text", function (str) {
		console.log("Received "+str)
		var msg = {};
		msg.type = 'message';
		msg.data = conn.nickName + 'says:' + str;
		broadcast(JSON.stringify(msg));
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		var msg = {};
		msg.type = 'leave';
		msg.data = conn.nickName + 'leave';
		broadcast(JSON.stringify(msg));
	})
  conn.on("error", function (err) {
		console.log('err:' + err)
	})
}).listen(PORT);

function broadcast(str) {
	server.connections.forEach((connection)=>{
		connection.sendText(str)
	})
}
