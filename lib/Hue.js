'use strict';

var HueApi = require("node-hue-api").HueApi;
var lightState = require("node-hue-api").lightState;

var Hue = function (host, username) {
    this.api = new HueApi(host, username);
    this.lightState = lightState;
};

Hue.prototype.setLight = function (lightId, lightState) {
    return this.api.setLightState(lightId, lightState);
};

module.exports = Hue;