// JavaScript source code

var connection = {};
var mySpaceship;

function establishConnection() {
	if (window.MozWebSocket) {
		window.WebSocket = window.MozWebSocket;
	}
	if (window.WebSocket != undefined) {
		if (connection.readyState === undefined || connection.readyState > 1) {
			connection = new WebSocket(SERVER_URL);
			connection.onopen = onOpen;
			connection.onclose = onClose;
			connection.onmessage = onMessage;
		}
	}
	else {
		alert("Your browser is not supporting WebSockets");
	}
};

function onOpen(evt) {
	console.log("polaczenie otwarte");
	var jsonMessage = {
		"msgType": "hello",
		"data": { "name": "Magda" },
	}
	connection.send(JSON.stringify(jsonMessage));
	console.log(connection.readyState);
};

function onClose(evt) {
	console.log("koneic polaczenia");
};

function sendMessage() {
	establishConnection();
	console.log("tu jtestms");
	var jsonMessage2 = {
		"msgType": "hello",
		"data": { "name": "Magda" },
	}
	console.log(connection);
	connection.send(jsonMessage2);
};

function onMessage(evt) {
	console.log("dostalem message");
	console.log(evt.data);
	var data = JSON.parse(evt.data);

	switch (data.msgType) {
		case "helloReply":
			mySpaceship = data.data.id;	
			break;
		case "gameState":
			parseGameObjects(data.data)
			
	}

};

function parseGameObjects(data) {
	var objects = new Array();
	for (var i = 0; i < data.asteroids.length; ++i) {
		var temp = new Asteroid(data.asteroids[i].x,
			data.asteroids[i].y, data.asteroids[i].size)
		objects.push(temp);
	}
	for (var i = 0; i < data.spaceships.length; ++i) {
		if (data.spaceships[i].id == mySpaceship) {
			var temp = new MySpaceship(data.spaceships[i].x,
				data.spaceships[i].y, data.spaceships[i].rot, data.spaceships[i].id);
		} else {
			var temp = new Spaceship(data.spaceships[i].x,
				data.spaceships[i].y, data.spaceships[i].rot, data.spaceships[i].id);
			
		}
		objects.push(temp);
	}
	for (var i = 0; i < data.projectiles.length; ++i) {
		var temp = new Projectile(data.projectiles[i].x, data.projectiles[i].y);
		objects.push(temp);
	}
	for (var i = 0; i < data.explosions.length; ++i) {
		var temp = new Explosion(data.explosions[i].x, data.explosions[i].y);
		objects.push(temp);
	}
	
}

function onKeyPress(evt) {
	console.log("tu jestm");
	var keyType;
	switch (evt.keyCode) {
		case MOVE_UP:
			keyType = "up";
			break;
		case MOVE_DOWN:
			keyType = "down";
			break;			
	}
	

	/*
	var json = {
		"msgType": "move",
		"data": {
			"key" : keyType
		}
	}
	connection.send(JSON.stringify(json));
	*/
};

function testMethod() {
	var json = {
		"msgType" : "gameState" ,
		"data" : {
			"asteroids" : [
				{ "x" : 10, "y" : 10 },
				{ "x" : 20, "y" : 20 }
			],
			"spaceships" : [
			],
			"projectiles" : [
			],
			"explosions" : [
			],

		}
	}
	var data = JSON.parse(JSON.stringify(json));

	parseGameObjects(data.data);
}