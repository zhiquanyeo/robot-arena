// This set up the correct mocks for use when testing on a regular computer
(function() {
'use strict';
const mockery = require('mockery');

mockery.registerSubstitute('raspi', './mocks/raspi');
mockery.registerSubstitute('raspi-gpio', './mocks/raspi-gpio');
mockery.registerSubstitute('raspi-i2c', './mocks/raspi-i2c');
mockery.registerAllowables(['./index.js', './hardware-button', './lighted-hardware-button', 'events']);
mockery.enable();

require('./index.js');
})();