(function() {
'use strict';

function I2C(pins) {

	var _registers = {};

	this._mockSetRegister = function (register, val) {
		_registers[register] = val;
	};

	this.read = function (addr, register, length, cb) {
		if (arguments.length === 3) {
			cb = length;
			length = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Reading ' + length + 
					' bytes from 0x' + 
					(register !== undefined ? register.toString(16) : '--'));
		if (_registers[register]) {
			cb(null, _registers[register]);
		}
		else {
			cb(null, new Buffer(length));
		}
	};

	this.readSync = function (address, register, length) {
		if (arguments.length === 2) {
			cb = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Reading ' + length + 
					' bytes from 0x' + 
					(register !== undefined ? register.toString(16) : '--'));
		if (_registers[register]) {
			return _registers[register];
		}
		else {
			return new Buffer[length];
		}
	};

	this.readByte = function (address, register, cb) {
		if (arguments.length === 2) {
			cb = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Reading Byte from ' +
					'0x' + 
					(register !== undefined ? register.toString(16) : '--'));
		if (_registers[register]) {
			cb(null, _registers[register]);
		}
		else {
			cb(null, 0x00);
		}
	};

	this.readByteSync = function (address, register) {
		console.log('[i2c:0x', address.toString(16), '] Reading Byte from 0x' + 
					register.toString(16));
		if (_registers[register]) {
			return _registers[register];
		}
		else {
			return 0x00;
		}
	};

	this.readWord = function (address, register, cb) {
		if (arguments.length === 2) {
			cb = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Reading Word from ' +
					'0x' + 
					(register !== undefined ? register.toString(16) : '--'));
		if (_registers[register]) {
			cb(null, _registers[register]);
		}
		else {
			cb(null, 0x00);
		}
	};

	this.readWordSync = function (address, register) {
		console.log('[i2c:0x' + address.toString(16) + '] Reading Word from ' +
					'0x' + register.toString(16));
		if (_registers[register]) {
			return _registers[register];
		}
		else {
			return 0x00;
		}
	};

	this.write = function (address, register, buffer, cb) {
		if (arguments.length === 3) {
			cb = buffer;
			buffer = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Wrote ' + 
					 buffer.length + ' bytes to ' + '0x' + 
					 (register !== undefined ? register.toString(16) : '--'));
		cb(null, buffer.length);
	};

	this.writeSync = function (address, register, buffer) {
		if (arguments.length === 2) {
			buffer = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Wrote ' + 
					 buffer.length + ' bytes to ' + '0x' + 
					 (register !== undefined ? register.toString(16) : '--'));
	};

	this.writeByte = function (address, register, byte, cb) {
		if (arguments.length === 3) {
			cb = byte;
			byte = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Wrote 0x' + 
					 byte.toString(16) + ' to ' + '0x' + 
					 (register !== undefined ? register.toString(16) : '--'));
		cb(null, 1);
	};

	this.writeByteSync = function (address, register, byte) {
		if (arguments.length === 2) {
			byte = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Wrote 0x' + 
					 byte.toString(16) + ' to ' + '0x' + 
					 (register !== undefined ? register.toString(16) : '--'));
	};

	this.writeWord = function (address, register, word, cb) {
		if (arguments.length === 3) {
			cb = word;
			word = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Wrote 0x' + 
					 byte.toString(16) + ' to ' + '0x' + 
					 (register !== undefined ? register.toString(16) : '--'));
		cb(null, 2);
	};

	this.writeWordSync = function (Address, register, word) {
		if (arguments.length === 2) {
			word = register;
			register = undefined;
		}

		console.log('[i2c:0x' + address.toString(16) + '] Wrote 0x' + 
					 byte.toString(16) + ' to ' + '0x' + 
					 (register !== undefined ? register.toString(16) : '--'));
	};
}

module.exports = {
	I2C: I2C
};
})();