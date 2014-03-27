'use strict';

var Jenkins = require('./Jenkins');
var Hue = require('./Hue');
var hueLightStates = require('./HueLightStates');

var JenkinsHue = function (config) {
    this.config = null;
    this.hueLightStates = hueLightStates;
    this._currentLightStates = {};

    if (config) {
        this.init(config);
    }

    return this;
};

function getHueColorByJobColor(jobColor) {
    switch (jobColor) {
        case 'green':
        case 'blue':
            return hueLightStates.PASSED;
        case 'red':
            return hueLightStates.FAILED;
        case 'yellow':
            return hueLightStates.WARNING;
        case 'deactivated':
        case 'disabled':
        default:
            return hueLightStates.DEACTIVATED;
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

    return this.jenkins.getJobColor(jobName)
        .then(function (jobColor) {
            this.setLight(lightId, jobColor);
        }.bind(this));
};

JenkinsHue.prototype.setLightForJenkinsView = function(lightId) {
    if (!this.config) {
        throw new Error('No configuration found. Please call init()');
    }

    return this.jenkins.getViewColor()
        .then(function (viewColor) {
            this.setLight(lightId, viewColor);
        }.bind(this));
};

JenkinsHue.prototype.setLight = function(lightId, color) {
    var hueColor = getHueColorByJobColor(color);
    this._setCurrentLightState(lightId, hueColor);
};

JenkinsHue.prototype.blinkLight = function(lightId) {
    this.hue.setLight(lightId, this.hue.lightState.create().alert());
};

JenkinsHue.prototype._setCurrentLightState = function(lightId, hueColor) {
    if (this._currentLightStates[lightId] !== hueColor) {
        this.hue.setLight(lightId, hueColor);
        this.blinkLight(3);
    }
    this._currentLightStates[lightId] = hueColor;
};

JenkinsHue.prototype.getCurrentLightState = function(lightId) {
    return this._currentLightStates[lightId] || null;
};

module.exports = JenkinsHue;