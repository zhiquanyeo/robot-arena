(function() {
'use strict';
const raspi = require('raspi');
const Arena = require('./arena');

var arenaConfig = {
	matchButton: {
		buttonPin: 1,
		lightPin: 2
	},
	playerStations: {
		'red': {
			button: {
				buttonPin: 3,
				lightPin: 4,
			}
		},
		'blue': {
			button: {
				buttonPin: 5,
				lightPin: 6,
			}
		}
	}
};

// Wait for board init
raspi.init(function () {

var arena = new Arena(arenaConfig);

});

})();