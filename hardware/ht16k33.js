(function () {
'use strict';

// Constants
var DEFAULT_ADDRESS 		= 0x70;
var HT16K33_BLINK_CMD 		= 0x80;
var HT16K33_BLINK_DISPLAYON = 0x01;
var HT16K33_BLINK_OFF 		= 0x00;
var HT16K33_BLINK_2HZ 		= 0x02;
var HT16K33_BLINK_1HZ 		= 0x04;
var HT16K33_BLINK_HALFHZ 	= 0x06;
var HT16K33_SYSTEM_SETUP 	= 0x20;
var HT16K33_OSCILLATOR 		= 0x01;
var HT16K33_CMD_BRIGHTNESS 	= 0xE0;

class HT16K33 {
	constructor(address, i2c) {
		this.d_i2c = i2c;
		this.d_addr = address;
		this.d_buffer = new Buffer(16);
	}

	begin() {
		// Initialize driver with LEDs enabled and all turned off
		// Wake up the oscillator
		this.d_i2c.writeByteSync(this.d_addr, HT16K33_SYSTEM_SETUP | HT16K33_OSCILLATOR);
		// Turn display on with no blinking
		this.set_blink(HT16K33_BLINK_OFF);
		// Set display to full brightness
		this.set_brightness(15);
	}

	set_blink(frequency) {
		if ([HT16K33_BLINK_OFF, HT16K33_BLINK_2HZ, HT16K33_BLINK_1HZ, HT16K33_BLINK_HALFHZ].indexOf(frequency) === -1) {
			throw new Error('Invalid Frequency');
		}
		this.d_i2c.writeByteSync(this.d_addr, HT16K33_BLINK_CMD | HT16K33_BLINK_DISPLAYON | frequency);
	}

	set_brightness(brightness) {
		if (brightness < 0 || brightness > 15) {
			throw new Error('Brightness must be between 0 and 15');
		}
		this.d_i2c.writeByteSync(this.d_addr, HT16K33_CMD_BRIGHTNESS | brightness);
	}

	set_led(led, value) {
		if (led < 0 || led > 127) {
			throw new Error('LED must be between 0 and 127');
		}
		// Calculate position in byte buffer and bit offset of desired LED
		var pos = Math.floor(led / 8);
		var offset = led % 8;

		if (!value) {
			// Turn off the specified LED
			this.d_buffer[pos] &= ~(1 << offset);
		}
		else {
			// Turn on the specified LED
			this.d_buffer[pos] |= (1 << offset);
		}
	}

	write_display() {
		for (var i = 0; i < this.d_buffer.length; i++) {
			this.d_i2c.writeByteSync(this.d_addr, i, this.d_buffer[i]);
		}
	}

	// Clear contents of display buffer
	clear() {
		for (var i = 0; i < this.d_buffer.length; i++) {
			this.d_buffer[i] = 0;
		}
	}
}

module.exports = HT16K33;
})();