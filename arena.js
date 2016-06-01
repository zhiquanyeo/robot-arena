(function () {
'use strict';
const EventEmitter = require('events');
const LightedHardwareButton = require('./lighted-hardware-button');
const I2C = require('raspi-i2c').I2C;
const MatchClock = require('./match-clock');
const PlayerStation = require('./player-station');
const Stately = require('stately.js');
// States
var STATE_IDLE = 'idle';
var STATE_PARTIAL_READY = 'partial-ready';
var STATE_FULLY_READY = 'fully-ready';
var STATE_MATCH_IN_PROGRESS = 'match-in-progress';
var STATE_MATCH_END = 'match-end';

/**
 * Arena Control 
 * This class manages the state of the arena and all hardware controls
 */
class Arena extends EventEmitter {
	constructor(config) {
		super();
		// Internal properties
		this.d_matchButton = null;
		this.d_players = {};
		this.d_i2c = new I2C();
		this.d_matchClock = new MatchClock(this.d_i2c);

		this.d_currentState = STATE_IDLE;
		this.d_matchTimerToken = null;
		this.d_currClock = 0;
		this.d_currClockStart = 0;

		this.d_arenaState = {
			playerStations: {},
			matchTime: 0,
		};

		if (!config) {
			throw new Error('Arena configuration is required');
		}

		if (!config.matchButton) {
			throw new Error('Match Button configuration is required');
		}

		this.d_matchTime = 180; // seconds
		if (config.matchTime !== undefined) {
			this.d_matchTime = config.matchTime;
		}

		this.d_matchButton = new LightedHardwareButton(config.matchButton);

		if (config.playerStations) {
			for (var pId in config.playerStations) {
				var playerStationInfo = config.playerStations[pId];
				var playerStation = new PlayerStation(playerStationInfo);
				
				this.d_players[pId] = playerStation;
			}
		}

		var _arenaThis = this;

		// Utility function for reset
		var _arenaReset = function() {
			for (var pId in _arenaThis.d_players) {
				var ps = _arenaThis.d_players[pId];
				ps.reset();
			}

			if (_arenaThis.d_matchTimerToken) {
				clearInterval(_arenaThis.d_matchTimerToken);
				_arenaThis.d_matchTimerToken = undefined;
			}
		};

		// Utility function for getting arena ready for match
		var _setArenaReady = function (fsm) {
			// Set up the button
			_arenaThis.d_matchButton.setLight(true);

			// When the button is pressed, we start the match
			_arenaThis.d_matchButton.once('pressed', function () {
				_arenaThis.d_matchButton.setLight(false);
				fsm.setMachineState(STATE_MATCH_IN_PROGRESS);

				if (_arenaThis.d_matchTimerToken) {
					clearInterval(_arenaThis.d_matchTimerToken);
					_arenaThis.d_matchTimerToken = undefined;
				}

				_arenaThis.d_currClockStart = (new Date()).getTime();
				_arenaThis.d_currClock = _arenaThis.d_currClockStart;
				var matchTimeMs = _arenaThis.d_matchTime * 1000;
				// Start the clock
				_arenaThis.d_matchTimerToken = setInterval(function () {
					_arenaThis.d_currClock = (new Date()).getTime();
					var elapsed = _arenaThis.d_currClock - _arenaThis.d_currClockStart;
					var matchTimeLeftMs = matchTimeMs - elapsed;

					if (matchTimeLeftMs > 0) {
						_arenaThis.d_matchClock.setTime(matchTimeLeftMs / 1000);
					}
					else {
						_arenaThis.d_matchClock.setTime(0);
						clearInterval(_arenaThis.d_matchTimerToken);
						fsm.setMachineState(STATE_MATCH_END);
					}
				}, 10);
			});
		};

		this.d_fsm = Stately.machine({
			'idle': {
				ready: function () {
					var _actionThis = this;
					// Set all player stations to 'ready'
					var psCount = Object.keys(this.d_players).length;

					var _checkReadyFunc = function () {
						psCount--;
						if (psCount === 0) {
							_actionThis.setMachineState(STATE_FULLY_READY);
							_setArenaReady(_actionThis);
						}
					};

					for (var pId in _arenaThis.d_players) {
						var ps = _arenaThis.d_players[pId];
						ps.once('ready', _checkReadyFunc);
						ps.setReady();
					}
					return STATE_PARTIAL_READY;
				}
			},
			'partial-ready': {
				reset: function () {
					_arenaReset();
				}
			},
			'fully-ready': {
				reset: function () {
					_arenaReset();
				}
			},
			'match-in-progress': {
				reset: function () {
					_arenaReset();
				}
			},
			'match-end': {
				reset: function () {
					_arenaReset();
				}
			}
		});

		console.log('Arena Init Complete');
	}

}

module.exports = Arena;
})();