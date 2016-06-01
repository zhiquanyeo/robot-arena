(function () {'use strict';
const GPIO = require('raspi-gpio');
const EventEmitter = require('events');

var POLL_INTERVAL_MS = 10;
var ALLOWED_EVENTS = ['changed', 'lowToHigh', 'highToLow'];

class HardwareButton extends EventEmitter {
	constructor(config) {
		super();
		if (!config) {
			throw new Error('Configuration object is required');
		}

		if (!config.button || config.button.pin === undefined) {
			throw new Error('Button configuration required');
		}

		var buttonCfg = config.button;
		var pullResistor = GPIO.PULL_NONE;

		this.d_activeState = GPIO.HIGH;
		if (buttonCfg.pullResistor !== undefined) {
			pullResistor = buttonCfg.pullResistor;
		}

		if (buttonCfg.activeState !== undefined) {
			this.d_activeState = buttonCfg.activeState;
		}

		this.d_buttonHW = new GPIO.DigitalInput({
			pin: buttonCfg.pin,
			pullResistor: pullResistor
		});
		
		// Get an initial state
		this.d_currState = this.d_buttonHW.read();

		this.on('newListener', function (event, listener) {
			if (ALLOWED_EVENTS.indexOf(event) === -1) {
				return;
			}

			if (!this.d_statePoller) {
				this.d_statePoller = setInterval(function () {
					var state = this.d_buttonHW.read();
					if (state !== this.d_currState) {
						// The changed event represents whether the button is 
						// pressed or released, not whether it's high or low
						this.emit('changed', state === this.d_activeState);
					}
					if (this.d_currState !== this.d_activeState && 
						state === this.d_activeState) {
						this.emit('pressed');
					}
					if (this.d_currState === this.d_activeState && 
						state !== this.d_activeState) {
						this.emit('released');
					}

					this.d_currState = state;
				}.bind(this), POLL_INTERVAL_MS);
			}
		}.bind(this));

		this.on('removeListener', function () {
			var listenerCount = 0;
			ALLOWED_EVENTS.forEach(function (evtName) {
				listenerCount += this.listenerCount(evtName);
			}.bind(this));

			if (listenerCount === 0 && this.d_statePoller) {
				clearInterval(this.d_statePoller);
			}	
		}.bind(this));
	}

	get value() {
		this.d_currState = this.d_buttonHW.read();
		return this.d_currState;
	}
}

module.exports = HardwareButton;
})();