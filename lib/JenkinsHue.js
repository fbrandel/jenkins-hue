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

function getHueLightStateByJobColor(jobColor) {
    switch (jobColor) {
        case 'green':
        case 'green_anime':
        case 'blue':
        case 'blue_anime':
            return hueLightStates.PASSED;
        case 'red':
        case 'red_anime':
            return hueLightStates.FAILED;
        case 'yellow':
        case 'yellow_anime':
            return hueLightStates.INSTABLE;
        case 'disabled':
        case 'disabled_anime':
        case 'aborted':
        case 'aborted_anime':
        case 'grey':
        case 'grey_anime':
        case 'notbuilt':
        case 'notbuilt_anime':
        default:
            return hueLightStates.DISABLED;
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
    var hueLightState = getHueLightStateByJobColor(color);
    this._setCurrentLightState(lightId, hueLightState);
};

/**
 * Blinks the given light
 *
 * @param lightId
 */
JenkinsHue.prototype.blinkLight = function (lightId) {
    return this.hue.setLight(lightId, this.hue.lightState.create().alert());
};

/**
 * Switches the given light off
 *
 * @param lightId
 */
JenkinsHue.prototype.switchOff = function (lightId) {
	return this._setCurrentLightState(lightId, hueLightStates.OFF);
};

JenkinsHue.prototype._setCurrentLightState = function (lightId, hueColor) {
    if (this._currentLightStates[lightId] !== hueColor) {
        this.hue.setLight(lightId, hueColor).then(function () {
            this.blinkLight(lightId);
        }.bind(this));
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