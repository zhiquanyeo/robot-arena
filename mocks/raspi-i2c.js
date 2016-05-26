(function() {
'use strict';

function I2C(pins) {

	this.read = function (addr, register, length, cb) {

	};

	this.readSync = function (address, register, length) {

	};

	this.readByte = function (address, register, cb) {

	};

	this.readByteSync = function (address, register) {

	};

	this.readWord = function (address, register, cb) {

	};

	this.readWordSync = function (address, register) {

	};

	this.write = function (address, register, buffer, cb) {

	};

	this.writeSync = function (address, register, buffer) {

	};

	this.writeByte = function (address, register, byte, cb) {

	};

	this.writeByteSync = function (Address, register, byte) {

	};

	this.writeWord = function (address, register, word, cb) {

	};

	this.writeWordSync = function (Address, register, word) {

	};
}

module.exports = {
	I2C: I2C
};
})();