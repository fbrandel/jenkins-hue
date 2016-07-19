var lightState = require("node-hue-api").lightState;

module.exports = {
    FAILED: lightState.create().on().rgb(255, 0, 0).brightness(70),
    PASSED: lightState.create().on().rgb(0, 255, 0).brightness(70),
    INSTABLE: lightState.create().on().rgb(255, 165, 0).brightness(70),
    DISABLED: lightState.create().off(),
    OFF: lightState.create().off()
};
