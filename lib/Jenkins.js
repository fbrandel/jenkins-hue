'use strict';

var q = require('q');
var jenkinsApi = require("jenkins-api");

var Jenkins = function (host) {
    this.host = host;
    this.api = jenkinsApi.init(host);
};

Jenkins.prototype.getJobColor = function (jobName) {
    var deferred = q.defer();

    this.api.job_info(jobName, function (err, data) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(data.color);
        }
    });

    return deferred.promise;
};

Jenkins.prototype.getViewColor = function () {
    var deferred = q.defer();
    var hasFailedJobs = false;
    var hasUnstableJobs = false;

    var that = this;

    this.api.all_jobs(function (err, data) {
        if (err) {
            deferred.reject(new Error(err));
        }

        if (!data) {
            deferred.reject(new Error('Error when getting jobs for Jenkins host' + that.host));
        }

        for (var i = 0; i < data.length; i++) {
            if (data[i].color === 'red') {
                hasFailedJobs = true;
                break;
            } else if (data[i].color === 'yellow') {
                hasUnstableJobs = true;
                continue;
            }
        }

        if (hasFailedJobs) {
            deferred.resolve('red');
        } else if (hasUnstableJobs) {
            deferred.resolve('yellow');
        }

        deferred.resolve('green');
    });

    return deferred.promise;
};

module.exports = Jenkins;