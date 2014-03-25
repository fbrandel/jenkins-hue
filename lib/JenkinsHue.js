'use strict';

var Jenkins = require('./Jenkins');
var Hue = require('./Hue');
var hueColors = require('./HueColors');

var JenkinsHue = function (config) {
    this.config = null;

    if (config) {
        this.init(config);
    }

    return this;
};

function getHueColorByJobColor(jobColor) {
    switch (jobColor) {
        case 'green':
        case 'blue':
            return hueColors.PASSED;
        case 'red':
            return hueColors.FAILED;
        case 'yellow':
            return hueColors.WARNING;
        case 'deactivated':
        case 'disabled':
        default:
            return hueColors.DEACTIVATED;
    }
}

JenkinsHue.prototype.init = function (config) {
    this.config = config || {};

    if (this.config.jenkins) {
        this.jenkins = new Jenkins(this.config.jenkins.host);
    } else {
        throw new Error('No configuration for Jenkins CI server found.');
    }

    if (this.config.hue) {
        this.hue = new Hue(this.config.hue.host, this.config.hue.username);
    } else {
        throw new Error('No configuration for Hue Bridge found.');
    }
};

JenkinsHue.prototype.setLightForJenkinsJob = function (lightId, jobName) {
    if (!this.config) {
        throw new Error('No configuration found. Please call init()');
    }

    if (!lightId || !jobName) {
        throw new Error('Parameter is missing');
    }

    this.jenkins.getJobColor(jobName)
        .then(function (jobColor) {
            var hueColor = getHueColorByJobColor(jobColor);
            this.hue.setLight(lightId, hueColor);
        }.bind(this));
};

JenkinsHue.prototype.setLightForJenkinsView = function(lightId) {
    if (!this.config) {
        throw new Error('No configuration found. Please call init()');
    }

    this.jenkins.getViewColor()
        .then(function (viewColor) {
            var hueColor = getHueColorByJobColor(viewColor);
            this.hue.setLight(lightId, hueColor);
        }.bind(this));
};

module.exports = JenkinsHue;