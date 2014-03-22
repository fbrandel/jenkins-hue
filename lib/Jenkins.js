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

module.exports = Jenkins;