(function() {
'use strict';
const GPIO = require('raspi-gpio');
const I2C = require('raspi-i2c').I2C;
const LightedHardwareButton = require('./lighted-hardware-button');
const MatchClock = require('./match-clock');

var button = new LightedHardwareButton({
	buttonPin: 1,
	lightPin: 2
});

function meh() {
	console.log('whee');
}
button.on('changed', meh);
button.setLight(GPIO.HIGH);

console.log('waiting...');
setTimeout(function () {
	button.removeListener('changed', meh);
}, 1000);

})();