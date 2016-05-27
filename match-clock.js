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
		// Set up the clock and put in the colon
		this.d_displays[address].begin();
		this.d_displays[address].set_colon(true);
	}

	setTime(seconds) {
		for (var dispAddr in this.d_displays) {
			var display = this.d_displays[dispAddr];
			display.clear();
			display.print_number_str('300');
			display.write_display();
		}
	}
}

module.exports = MatchClock;
})();