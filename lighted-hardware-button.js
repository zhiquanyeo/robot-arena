(function() {
'use strict';
const GPIO = require('raspi-gpio');
const HardwareButton = require('./hardware-button');

/**
{
	button: {
		pin: <pin>,
		activeState: <state>,
		pullResistor: <resistor>
	},
	light: {
		simple: {
			pin: <pin>,
			activeState: <state>
		}, [OR]
		latching: {
			pinOn: <pin>,
			pinOff: <pin>,
			onActiveState: <state>,
			offActiveState: <state>,
			pulse: <bool>
		}
	}	
}
*/

class LightedHardwareButton extends HardwareButton {
	constructor(config) {
		super(config);

		this.d_lightActiveState = GPIO.HIGH;
		this.d_latchOnActiveState = GPIO.HIGH;
		this.d_latchOffActiveState = GPIO.HIGH;

		this.d_latchMode = false;

		if (!config.light) {
			throw new Error('Configuration information for light not found');
		}

		if (config.light.simple &&
			config.light.simple.pin !== undefined) {
			var simpleCfg = config.light.simple;
			// Simple, one pin, non-latching
			this.d_latchMode = false;
			this.d_simpleLightHW = new GPIO.DigitalOutput(simpleCfg.pin);

			this.d_simpleActiveState = GPIO.HIGH;
			if (simpleCfg.activeState !== undefined) {
				this.d_simpleActiveState = simpleCfg.activeState;
			}
		}
		else if (config.light.latching &&
				 config.light.latching.pinOn !== undefined &&
				 config.light.latching.pinOff !== undefined) {
			var latchingCfg = config.light.latching;
			// 2 pin, latching
			this.d_latchMode = true;
			this.d_latchOnHW = new GPIO.DigitalOutput(latchingCfg.pinOn);
			this.d_latchOffHW = new GPIO.DigitalOutput(latchingCfg.pinOff);

			this.d_latchOnActiveState = GPIO.HIGH;
			this.d_latchOffActiveState = GPIO.HIGH;
			if (latchingCfg.onActiveState !== undefined) {
				this.d_latchOnActiveState = latchingCfg.onActiveState;
			}
			if (latchingCfg.offActiveState !== undefined) {
				this.d_latchOffActiveState = latchingCfg.offActiveState;
			}

			this.d_latchPulseMode = true;
			if (latchingCfg.pulse !== undefined) {
				this.d_latchPulseMode = latchingCfg.pulse;
			}
		}
		else {
			throw new Error('Invalid light configuration');
		}
	}

	setLight(val) {
		if (this.d_latchMode) {
			if (val) {
				// Turn on
				// Pulse Mode
				if (this.d_latchPulseMode) {
					// Pulse the ON hardware
					this.d_latchOnHW.write(!this.d_latchOnActiveState);
					this.d_latchOffHW.write(!this.d_latchOffActiveState);

					this.d_latchOnHW.write(this.d_latchOnActiveState);
					setTimeout(function () {
						this.d_latchOnHW.write(!this.d_latchOnActiveState);
					}.bind(this), 15);
				}
				else {
					// requires current to be on
					this.d_latchOnHW.write(this.d_latchOnActiveState);
					this.d_latchOffHW.write(!this.d_latchOffActiveState);
				}
			}
			else {
				// Turn Off
				// Pulse Mode
				if (this.d_latchPulseMode) {
					// Pulse the ON hardware
					this.d_latchOnHW.write(!this.d_latchOnActiveState);
					this.d_latchOffHW.write(!this.d_latchOffActiveState);

					this.d_latchOffHW.write(this.d_latchOffActiveState);
					setTimeout(function () {
						this.d_latchOffHW.write(!this.d_latchOffActiveState);
					}.bind(this), 15);
				}
				else {
					// requires current to be on
					this.d_latchOnHW.write(!this.d_latchOnActiveState);
					this.d_latchOffHW.write(this.d_latchOffActiveState);
				}
			}
			
		}
		else {
			if (val) {
				this.d_simpleLightHW.write(this.d_simpleActiveState);
			}
			else {
				this.d_simpleLightHW.write(!this.d_simpleActiveState);
			}
		}
	}
}

module.exports = LightedHardwareButton;
})();