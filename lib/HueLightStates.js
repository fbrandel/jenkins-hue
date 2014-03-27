var lightState = require("node-hue-api").lightState;

module.exports = {
    FAILED: lightState.create().on().rgb(255, 0, 0).brightness(10),
    PASSED: lightState.create().on().rgb(0, 255, 0).brightness(10),
    WARNING: lightState.create().on().rgb(255, 255, 0).brightness(10),
    DEACTIVATED: lightState.create().off(),
    RUNNING: lightState.create().on().rgb(0, 0, 255).brightness(10)
};