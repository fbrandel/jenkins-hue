var Jenkins = require('../lib/Jenkins');
var expect = require('chai').expect;
var jenkins;

beforeEach(function () {
    jenkins = new Jenkins('http://ci.jruby.org');
});

describe('Jenkins', function () {
    it('should initialiaze the api', function () {
        expect(jenkins.api).to.be.ok;
    });

    describe('.getJobColor()', function () {
        it('should return green/blue color for a successful build', function () {
            return jenkins.getJobColor('jruby-git').then(function (color) {
                expect(color).to.be.equals('blue');
            });
        });
    });
});