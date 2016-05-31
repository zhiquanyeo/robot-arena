(function() {
'use strict';
const GPIO = require('raspi-gpio');
const HardwareButton = require('./hardware-button');

class LightedHardwareButton extends HardwareButton {
	constructor(config) {
		super(config);

		this.d_lightActiveState = GPIO.HIGH;
		this.d_latchMode = false;
		// Single, non latching
		if (config.lightPin !== undefined) {
			this.d_lightHW = new GPIO.DigitalOutput(config.lightPin);
		}
		else if (config.latching && 
				 config.latching.on !== undefined &&
				 config.latching.off !== undefined) {
			this.d_lightOnHW = new GPIO.DigitalOutput(config.latching.on);
			this.d_lightOffHW = new GPIO.DigitalOutput(config.latching.off);
			this.d_latchMode = true;
		}
		else {
			throw new Error('Light Pin is required');
		}

		if (config.lightActiveState !== undefined) {
			this.d_lightActiveState = config.lightActiveState;
		}
	}

	setLight(val) {
		if (this.d_latchMode) {
			if (val) {
				this.d_lightOnHW.write(this.d_lightActiveState);
				this.d_lightOffHW.write(!this.d_lightActiveState);
			}
			else {
				this.d_lightOnHW.write(!this.d_lightActiveState);
				this.d_lightOffHW.write(this.d_lightActiveState);
			}
		}
		else {
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
}

module.exports = LightedHardwareButton;
})();