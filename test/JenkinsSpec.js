var Jenkins = require('../lib/Jenkins');
var expect = require('chai').expect;
var sinon = require('sinon');
var jenkins;

// Mock Data
var jenkinsResponseJobPassed = require('./fixtures/jenkins.response.job.passed.json');
var jenkinsResponseJobFailed = require('./fixtures/jenkins.response.job.failed.json');
var jenkinsResponseViewPassed = require('./fixtures/jenkins.response.view.passed.json');
var jenkinsResponseViewUnstable = require('./fixtures/jenkins.response.view.unstable.json');
var jenkinsResponseViewFailed = require('./fixtures/jenkins.response.view.failed.json');


beforeEach(function () {
    jenkins = new Jenkins();
});

describe('Jenkins', function () {
    it('should initialiaze the api', function () {
        expect(jenkins.api).to.be.ok;
    });

    describe('#getJobColor()', function () {
        beforeEach(function() {
            sinon.stub(jenkins.api, 'job_info');
        });

        afterEach(function() {
            jenkins.api.job_info.restore();
        });

        it('should return blue for a passed job', function () {
            jenkins.api.job_info.yields(null, jenkinsResponseJobPassed);
            return jenkins.getJobColor('jruby-git').then(function (color) {
                expect(color).to.be.equals('blue');
            });
        });

        it('should return red for a failed job', function () {
            jenkins.api.job_info.yields(null, jenkinsResponseJobFailed);
            return jenkins.getJobColor('jruby-git').then(function (color) {
                expect(color).to.be.equals('red');
            });

        });
    });

    describe('#getViewColor()', function() {
        beforeEach(function() {
            sinon.stub(jenkins.api, 'all_jobs');
        });

        afterEach(function() {
            jenkins.api.all_jobs.restore();
        });

        it('should return green if all jobs are green', function() {
            jenkins.api.all_jobs.yields(null, jenkinsResponseViewPassed.jobs);
            return jenkins.getViewColor().then(function(color) {
                expect(color).to.be.equals('green');
            });
        });

        it('should return yellow if at least one job is yellow and no red jobs are found', function() {
            jenkins.api.all_jobs.yields(null, jenkinsResponseViewUnstable.jobs);
            return jenkins.getViewColor().then(function(color) {
                expect(color).to.be.equals('yellow');
            });
        });

        it('should return red if at least one job is red', function() {
            jenkins.api.all_jobs.yields(null, jenkinsResponseViewFailed.jobs);
            return jenkins.getViewColor().then(function(color) {
                expect(color).to.be.equals('red');
            });
        });
    });
});