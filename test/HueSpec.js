var Hue = require('../lib/Hue');
var expect = require('chai').expect;
var hue;

beforeEach(function () {
    hue = new Hue('', 'newdeveloper');
});

describe('Hue', function () {
    it('should initialize the api', function () {
        expect(hue.api).to.be.ok;
    });
});