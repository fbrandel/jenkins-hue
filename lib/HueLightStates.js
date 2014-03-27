var lightState = require("node-hue-api").lightState;

module.exports = {
    FAILED: lightState.create().on().rgb(255, 0, 0).brightness(10),
    PASSED: lightState.create().on().rgb(0, 255, 0).brightness(10),
    INSTABLE: lightState.create().on().rgb(255, 255, 0).brightness(10),
    DISABLED: lightState.create().off()
};