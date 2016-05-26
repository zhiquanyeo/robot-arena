(function() {
'use strict';
const GPIO = require('raspi-gpio');
const HardwareButton = require('./hardware-button');

class LightedHardwareButton extends HardwareButton {
	constructor(config) {
		super(config);

		if (config.lightPin !== undefined) {
			this.d_lightActiveState = GPIO.HIGH;
			if (config.lightActiveState !== undefined) {
				this.d_lightActiveState = config.lightActiveState;
			}

			this.d_lightHW = new GPIO.DigitalOutput(config.lightPin);
		}
		else {
			throw new Error('Light Pin is required');
		}
	}

	setLight(val) {
		if (val) {
			this.d_lightHW.write(this.d_lightActiveState);
		}
		else {
			if (this.d_lightActiveState === GPIO.HIGH) {
				this.d_lightHW.write(GPIO.LOW);
			}
			else {
				this.d_lightHW.write(GPIO.HIGH);
			}
		}
	}
}

module.exports = LightedHardwareButton;
})();