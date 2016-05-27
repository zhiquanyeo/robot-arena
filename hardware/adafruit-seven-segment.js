(function() {
'use strict';
const HT16K33 = require('./ht16k33');

// Digit value to bitmask mapping:
var DIGIT_VALUES = {
	' ': 0x00,
	'-': 0x40,
	'0': 0x3F,
	'1': 0x06,
	'2': 0x5B,
	'3': 0x4F,
	'4': 0x66,
	'5': 0x6D,
	'6': 0x7D,
	'7': 0x07,
	'8': 0x7F,
	'9': 0x6F,
	'A': 0x77,
	'B': 0x7C,
	'C': 0x39,
	'D': 0x5E,
	'E': 0x79,
	'F': 0x71
};

var IDIGIT_VALUES = {
	' ': 0x00,
	'-': 0x40,
	'0': 0x3F,
	'1': 0x30,
	'2': 0x5B,
	'3': 0x79,
	'4': 0x74,
	'5': 0x6D,
	'6': 0x6F,
	'7': 0x38,
	'8': 0x7F,
	'9': 0x7D,
	'A': 0x7E,
	'B': 0x67,
	'C': 0x0F,
	'D': 0x73,
	'E': 0x4F,
	'F': 0x4E
};

class AdafruitSevenSegment extends HT16K33 {
	constructor(address, i2c, invert) {
		super(address, i2c);
		if (invert === undefined) {
			invert = false;
		}

		this.d_invert = invert;
	}

	set_invert(invert) {
		this.d_invert = invert;
	}

	// Set digit at position to raw bitmask value. Position should be
	// a value of 0 to 3, with 0 being the left most digit
	set_digit_raw(pos, bitmask) {
		if (pos < 0 || pos > 3) {
			return;
		}

		// Jump past the colon at position 2 by adding a conditional offset
		var offset = 0;
		if (pos >= 2) {
			offset = 1;
		}

		// Calculate the correct position depending on orientation
		if (this.d_invert) {
			pos = 4 - (pos + offset);
		}
		else {
			pos = pos + offset;
		}

		// Set the digit bitmask value to the appropriate position
		this.d_buffer[pos * 2] = bitmask & 0xFF;
	}

	set_decimal(pos, decimal) {
		// Turn decimal point on or off at the provided position.
		// true = on, false = off
		if (pos < 0 || pos > 3) {
			return;
		}

		var offset = 0;
		if (pos >= 2) {
			offset = 1;
		}

		if (this.d_invert) {
			pos = 4 - (pos + offset);
		}
		else {
			pos = pos + offset;
		}

		// Set bit 7 (decimal point) based on provided val
		if (decimal) {
			this.d_buffer[pos * 2] |= (1 << 7);
		}
		else {
			this.d_buffer[pos * 2] &= ~(1 << 7);
		}
	}

	set_digit(pos, digit, decimal) {
		if (decimal === undefined) {
			decimal = false;
		}

		var bitmask;
		if (this.d_invert) {
			bitmask = IDIGIT_VALUES[digit.toString().toUpperCase()];
		}
		else {
			bitmask = DIGIT_VALUES[digit.toString().toUpperCase()];
		}
		if (bitmask === undefined) {
			bitmask = 0x00;
		}
		this.set_digit_raw(pos, bitmask);

		if (decimal) {
			this.set_decimal(true);
		}
	}

	set_colon(show_colon) {
		if (show_colon) {
			this.d_buffer[4] |= 0x02;
		}
		else {
			this.d_buffer[4] &= (~0x02) & 0xFF;
		}
	}

	set_left_colon(show_colon) {
		if (show_colon) {
			this.d_buffer[4] |= 0x04;
			this.d_buffer[4] |= 0x08;
		}
		else {
			this.d_buffer[4] &= (~0x04) & 0xFF;
			this.d_buffer[4] &= (~0x08) & 0xFF;
		}
	}

	set_fixed_decimal(show_decimal) {
		if (show_decimal) {
			this.d_buffer[4] |= 0x10;
		}
		else {
			this.d_buffer[4] &= ~(0x10) & 0xFF;
		}
	}

	// Print a 4 Character long string of numeric values to screen
	print_number_str(value, justify_right) {
		var i;
		if (justify_right === undefined) {
			justify_right = true;
		}

		// Calculate length without decimals
		var length = 0;
		for (i = 0; i < value.length; i++) {
			if (value.charAt(i) !== '.') {
				length++;
			}
		}

		if (length > 4) {
			this.print_number_str('----');
			return;
		}

		// Calculate starting position of digits based on justification
		var pos = 0;
		if (justify_right) {
			pos = 4 - length;
		}

		// Go through each character and print it on the display
		for (i = 0; i < value.length; i++) {
			var ch = value.charAt(i);
			if (ch === '.') {
				this.set_decimal(pos - 1, true);
			}
			else {
				this.set_digit(pos, ch);
				pos++;
			}
		}
	}

	print_float(value, decimal_digits, justify_right) {
		if (decimal_digits === undefined) {
			decimal_digits = 2;
		}
		if (justify_right === undefined) {
			justify_right = true;
		}

		// TBD Implement
	}

	print_hex(value, justify_right) {
		if (justify_right === undefined) {
			justify_right = true;
		}
		if (value < 0 || value > 0xFFFF) {
			return;
		}
		this.print_number_str(value.toString(16), justify_right);
	}
}

module.exports = AdafruitSevenSegment;
})();