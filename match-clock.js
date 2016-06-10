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
		// Convert to the form of MM:SS
		var mins = Math.floor(seconds / 60);
		var secs = seconds % 60;
		
		var timeStr;
		if (mins < 0 || mins > 99 || secs < 0 || secs > 59) {
			timeStr = '----';
		}
		else {
			var minStr = (mins < 10 ? '0' : '') + mins.toString();
			var secStr = (secs < 10 ? '0' : '') + secs.toString();
			timeStr = minStr + secStr;
		}
		
		for (var dispAddr in this.d_displays) {
			var display = this.d_displays[dispAddr];
			display.clear();
			display.print_number_str(timeStr);
			display.write_display();
		}
	}
	
	reset() {
		for (var dispAddr in this.d_displays) {
			var display = this.d_displays[dispAddr];
			display.clear();
			display.print_number_str('----');
			display.write_display();
		}
	}
}

module.exports = MatchClock;
})();