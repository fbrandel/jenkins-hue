var hueColors = require('../lib/HueLightStates');
var expect = require('chai').expect;

var states = ['FAILED', 'PASSED', 'RUNNING', 'DEACTIVATED'];

describe('HueLightStates', function () {
    it('should contain all build states represented by a hue lightState', function () {
        expect(hueColors).to.include.keys(states);
    });
});