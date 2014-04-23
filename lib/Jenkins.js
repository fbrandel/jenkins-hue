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
			return deferred.promise;
        }

        for (var i = 0; i < data.length; i++) {
            if (data[i].color === 'red' || data[i].color === 'red_anime') {
                hasFailedJobs = true;
                break;
            } else if (data[i].color === 'yellow' || data[i].color === 'yellow_anime') {
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