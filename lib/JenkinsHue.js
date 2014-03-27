'use strict';

var Jenkins = require('./Jenkins');
var Hue = require('./Hue');
var hueLightStates = require('./HueLightStates');

/**
 * @param config
 * @returns {JenkinsHue}
 * @constructor
 */
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

/**
 * Initializing
 * @param config
 */
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

/**
 * Retrieves the current build state of the given jobName and lights the
 * hue light with the given light Id
 *
 * @param lightId
 * @param jobName
 * @returns {*}
 */
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

/**
 * Retrieves the build information of all builds in the view and returns green
 * if all jobs are green, or red if at least one job is red
 *
 * @param lightId
 * @returns {*}
 */
JenkinsHue.prototype.setLightForJenkinsView = function (lightId) {
    if (!this.config) {
        throw new Error('No configuration found. Please call init()');
    }

    return this.jenkins.getViewColor()
        .then(function (viewColor) {
            this.setLight(lightId, viewColor);
        }.bind(this));
};

/**
 * Lights the given hue light id with the given color
 *
 * @param lightId
 * @param color [red, green, yellow, disabled, deactivated]
 */
JenkinsHue.prototype.setLight = function (lightId, color) {
    var hueColor = getHueColorByJobColor(color);
    this._setCurrentLightState(lightId, hueColor);
};

/**
 * Blinks the given light
 *
 * @param lightId
 */
JenkinsHue.prototype.blinkLight = function (lightId) {
    this.hue.setLight(lightId, this.hue.lightState.create().alert());
};

JenkinsHue.prototype._setCurrentLightState = function (lightId, hueColor) {
    if (this._currentLightStates[lightId] !== hueColor) {
        this.hue.setLight(lightId, hueColor);
        this.blinkLight(lightId);
    }
    this._currentLightStates[lightId] = hueColor;
};

/**
 * Gets the current lightState of the hue light
 *
 * @param lightId
 * @returns {*|null}
 */
JenkinsHue.prototype.getCurrentLightState = function (lightId) {
    return this._currentLightStates[lightId] || null;
};

module.exports = JenkinsHue;