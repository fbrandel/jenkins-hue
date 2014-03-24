# Jenkins-Hue

Colors your Philips Hue Lights based on a Jenkins build state.

## Example

```
var JenkinsHue = require('jenkins-hue');
var jenkinsHue = new JenkinsHue({
    jenkins: {
        host: 'http://ci.jruby.org'
    },
    hue: {
        host: '192.168.178.39',
        username: 'newdeveloper'
    }
});

// Hue light with the ID '1' should reflect the
// build state (green, red, deactivated etc.):

jenkinsHue.setLightForJenkinsJob(1, 'jruby-dist-1_7');

```