# Jenkins-Hue

Colors your Philips Hue Lights based on a Jenkins build state.

## Installation

    npm install jenkins-hue

## Example

### Configuration

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

### Let there be light!

#### Single Jenkins Job:

Hue light with the ID '1' should reflect the build state (green, red, yellow, deactivated) of a given job:

    jenkinsHue.setLightForJenkinsJob(1, 'jruby-dist-1_7');

#### Jenkins View:

Hue light reflects the state of the Jenkins view, which means all jobs available under the given host URL. If at least one build failed the light turns red.

    jenkinsHue.setLightForJenkinsView(1);
