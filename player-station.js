(function() {
'use strict';

const EventEmitter = require('events');
const LightedHardwareButton = require('./lighted-hardware-button');
const Stately = require('stately.js');

var STATE_IDLE = 'idle';
var STATE_WAITING = 'waiting';
var STATE_ACTIVE = 'active';
var STATE_ERROR = 'error';

class PlayerStation extends EventEmitter {
	constructor(config) {
		super();
		
		// Set up the hardware
		this.d_button = null;
		this.d_indicator = null; // TBD this is an LED array

		if (!config) {
			throw new Error('Configuration for Player Station must be provided');
		}

		if (!config.button) {
			throw new Error('Button Configuration must be provided');
		}

		this.d_button = new LightedHardwareButton(config.button);
		
		// Hook up the button events

		if (config.display) {
			// TBD: Configure the LED Display
		}

		var _psThis = this;
		// Set up the state machine
		this.d_fsm = Stately.machine({
			'idle': {
				ready: function () {
					_psThis.d_button.setLight(true);

					var _actionThis = this;

					// When the button is pressed and we transition to active,
					// Turn off the light and emit the event
					_psThis.once('pressed', function () {
						_psThis.d_button.setLight(false);
						_psThis.emit('ready');
						_actionThis.setMachineState(STATE_ACTIVE);
					});

					_psThis.emit('waiting');
					return STATE_WAITING;
				},
				setError: function () {
					// TBD: Show Error Screen
					return STATE_ERROR;
				}
			},
			'waiting': {
				reset: function () {
					// Clean up
					_psThis.d_button.setLight(false);
					_psThis.emit('idle');
					return STATE_IDLE;
				},
				setError: function () {
					// TBD: Show Error screen
					return STATE_ERROR;
				}
			},
			'active': {
				disable: function () {
					_psThis.d_button.setLight(false);
					_psThis.emit('idle');
					return STATE_IDLE;
				},
				setError: function () {
					// TBD: Show error screen
					return STATE_ERROR;
				}
			},
			'error': {
				reset: function () {
					_psThis.d_button.setLight(false);
					_psThis.emit('idle');
					return STATE_IDLE;
				}
			}
		});
	}

	get buttonState() {
		return this.d_button.value;
	}

	setReady() {
		this.d_fsm.ready();
	}

	reset() {
		this.d_fsm.reset();
	}

	setError() {
		this.d_fsm.setError();
	}

	getState() {
		return this.d_fsm.getMachineState();
	}
}

PlayerStation.STATE_IDLE = STATE_IDLE;
PlayerStation.STATE_WAITING = STATE_WAITING;
PlayerStation.STATE_ACTIVE = STATE_ACTIVE;
PlayerStation.STATE_ERROR = STATE_ERROR;

module.exports = PlayerStation;
})();