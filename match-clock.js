/**
 * Implementation of an I2C based Clock Display
 * Allows the control of multiple physical 7-segment LED displays
 *  
 */
(function () {
'use strict';
const EventEmitter = require('events');

class MatchClock extends EventEmitter {
	constructor(i2c) {
		super();
		// Set up some internals
		this.d_i2c = i2c;
		this.d_displays = []; // Stores the address of the displays
	}
}

module.exports = MatchClock;
})();