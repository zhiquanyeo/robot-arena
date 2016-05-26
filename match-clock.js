/**
 * Implementation of an I2C based Clock Display
 * Allows the control of multiple physical 7-segment LED displays
 *  
 */
(function () {
'use strict';
const EventEmitter = require('events');
const SevenSegmentDisplay = require('./hardware/adafruit-seven-segment');

class MatchClock extends EventEmitter {
	constructor(i2c) {
		super();
		// Set up some internals
		this.d_i2c = i2c;
		this.d_displays = {}; // Map of i2c address to SevenSegmentDisplay
	}

	addPhysicalDisplay(address, invert) {
		if (this.d_displays[address]) {
			console.warn('Display with this address already added');
			return;
		}
		this.d_displays[address] = new SevenSegmentDisplay(address, this.d_i2c, invert);
	}
}

module.exports = MatchClock;
})();