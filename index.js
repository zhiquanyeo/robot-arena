(function() {
'use strict';
const raspi = require('raspi');
const Arena = require('./arena');

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

});

})();