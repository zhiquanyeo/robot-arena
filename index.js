(function() {
'use strict';
const raspi = require('raspi');
const Arena = require('./arena');
const Express = require('express');
const App = Express();
const Server = require('http').createServer(App);
const IO = require('socket.io')(Server);

var arenaConfig = {
	matchButton: {
		button: {
			pin: 1
		},
		light: {
			latching: {
				pinOn: 2,
				pinOff: 3,
				pulse: true
			}
		}
	},
	playerStations: {
		'red': {
			button: {
				button: {
					pin: 4,
				},
				light: {
					latching: {
						pinOn: 5,
						pinOff: 6,
						pulse: true
					}
				}
			}
		},
		'blue': {
			button: {
				button: {
					pin: 7,
				},
				light: {
					latching: {
						pinOn: 8,
						pinOff: 9,
						pulse: true
					}
				}
			}
		}
	}
};

// Wait for board init
raspi.init(function () {

var arena = new Arena(arenaConfig);

// Set up the web server
App.use(Express.static(__dirname + '/bower_components'));
App.get('/', function (req, res, next) {
	res.sendFile(__dirname + '/index.html');
})

Server.listen(4200);

// === END
});

})();