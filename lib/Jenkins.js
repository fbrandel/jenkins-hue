'use strict';

var q = require('q');
var jenkinsApi = require("jenkins-api");

var Jenkins = function (host) {
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

    this.api.all_jobs(function (err, data) {
        if (err) {
            deferred.reject(new Error(err));
        }

        for (var i = 0; i < data.length; i++) {
            if (data[i].color === 'red') {
                deferred.resolve('red');
                break;
            }
        }

        deferred.resolve('green');
    });

    return deferred.promise;
};

module.exports = Jenkins;