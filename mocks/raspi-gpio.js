(function() {
'use strict';

var LOW = 0, HIGH = 1, PULL_NONE = 0, PULL_DOWN = 1, PULL_UP = 2;

function DigitalInput(config) {
	var d_val = LOW;
	this._mockSetVal = function (val) {
		d_val = val;
	};

	this.read = function () {
		return d_val;
	};
}

function DigitalOutput(peripheral) {
	this.write = function (val) {
		console.log('[DOUT:' + peripheral + '] Writing: ', val);
	};
}

module.exports = {
	DigitalInput: DigitalInput,
	DigitalOutput: DigitalOutput,
	LOW: LOW,
	HIGH: HIGH,
	PULL_NONE: PULL_NONE,
	PULL_DOWN: PULL_DOWN,
	PULL_UP: PULL_UP
};
})();