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

		if (config.buttonPin !== undefined) {
			var pullResistor = GPIO.PULL_NONE;
			if (config.buttonPullResistor !== undefined) {
				pullResistor = config.buttonPullResistor;
			}

			this.d_buttonHW = new GPIO.DigitalInput({
				pin: config.buttonPin,
				pullResistor: pullResistor
			});
		}
		else {
			throw new Error('Button Pin is required');
		}

		this.d_currState = undefined;

		this.on('newListener', function (event, listener) {
			if (ALLOWED_EVENTS.indexOf(event) === -1) {
				return;
			}

			if (!this.d_statePoller) {
				this.d_statePoller = setInterval(function () {
					var state = this.d_buttonHW.read();
					if (state !== this.d_currState) {
						this.emit('changed', state);
					}
					if (this.d_currState === GPIO.LOW && state === GPIO.HIGH) {
						this.emit('lowToHigh');
					}
					if (this.d_currState === GPIO.HIGH && state === GPIO.LOW) {
						this.emit('highToLow');
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

	getValue() {
		this.d_currState = this.d_buttonHW.read();
		return this.d_currState;
	}
}

module.exports = HardwareButton;
})();