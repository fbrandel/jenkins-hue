'use strict';

var JenkinsHue = require('../lib/JenkinsHue');
var Jenkins = require('../lib/Jenkins');
var Hue = require('../lib/Hue');
var expect = require('chai').expect;
var jenkinsHue, jenkinsHueWithConfig;

var configuration = {
    jenkins: {
        host: 'http://ci.jruby.org'
    },
    hue: {
        host: '',
        username: ''
    }
};

describe('JenkinsHue', function () {

    beforeEach(function () {
        jenkinsHue = new JenkinsHue();
        jenkinsHueWithConfig = new JenkinsHue(configuration);
    });

    describe('Configuration', function () {
        it('should have no configuration by default', function () {
            var config = jenkinsHue.config;
            expect(config).to.be.null;
        });

        it('should have a configuration when one is given in the constructor', function () {
            var config = jenkinsHueWithConfig.config;
            expect(config).not.to.be.empty;
            expect(config.jenkins.host).to.be.equals('http://ci.jruby.org');
        });
    });

    describe('#init()', function () {
        it('should create an instance for Jenkins module', function () {
            jenkinsHue.init(configuration);
            expect(jenkinsHue.jenkins).to.be.instanceOf(Jenkins);
        });

        it('should create an instance for Hue module', function () {
            jenkinsHue.init(configuration);
            expect(jenkinsHue.hue).to.be.instanceOf(Hue);
        });
    });

    describe('#setLightForJenkinsJob()', function () {
        it('should fail with an error when no configuration was set', function () {
            expect(function () {
                jenkinsHue.setLightForJenkinsJob(1, 'foobar');
            }).to.throw(Error);
        });

        it('should fail when a parameter is missing', function () {
            expect(function () {
                jenkinsHueWithConfig.setLightForJenkinsJob();
            }).to.throw(Error);

            expect(function () {
                jenkinsHueWithConfig.setLightForJenkinsJob('bar');
            }).to.throw(Error);
        });
    });
});