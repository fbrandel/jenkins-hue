# Jenkins-Hue

Colors your Philips Hue Lights based on a Jenkins build state.

## Example

### Configuration

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
```

### Set light according to build state

```
// Hue light with the ID '1' should reflect the
// build state (green, red, yellow, deactivated) of a given job

jenkinsHue.setLightForJenkinsJob(1, 'jruby-dist-1_7');
```

### Set light according to a jenkins view

```
// Hue light reflects the state of the Jenkins view given in the configuration
// If at least one build failed the light turns red

jenkinsHue.setLightForJenkinsView(1);
```