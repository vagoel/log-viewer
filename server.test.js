var expect = require('chai').expect;
var request = require('supertest');

describe('API Call Works', function () {
    var server;
    beforeEach(function () {
        server = require('./server');
    });
    afterEach(function () {
        server.close();
    });
    it('should work', function () {
        expect(true).to.be.true;
    });
    it('responds to /', function (done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
    it('404 file not found-bar', function testPath(done) {
        request(server)
            .get('/file/bar')
            .expect(404, done);
    });
    it('200 file  found-log', function testPath(done) {
        request(server)
            .get('/file/log')
            .expect(200, done);
    });
    it('200 file found-error_log', function testPath(done) {
        request(server)
            .get('/file/error_log')
            .expect(200, done);
    });
    it('200 file found-access_log', function testPath(done) {
        request(server)
            .get('/file/access_log')
            .expect(200, done);
    });
    it('log file should have total records 50', function testPath(done) {
        request(server)
            .get('/file/log')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records).to.have.lengthOf(10);
                expect(res.body.meta.totalRecords).to.equal(50);
            })
            .end(done)
    });
    it('log file shpould have total records 50', function testPath(done) {
        request(server)
            .get('/file/log')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records).to.have.lengthOf(10);
                expect(res.body.meta.totalRecords).to.equal(50);
            })
            .end(done)
    });
    it('error_log file shpould have total records 76', function testPath(done) {
        request(server)
            .get('/file/error_log')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records).to.have.lengthOf(10);
                expect(res.body.meta.totalRecords).to.equal(76);
            })
            .end(done)
    });
    it('access_log file should have total records 1546', function testPath(done) {
        request(server)
            .get('/file/access_log')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records).to.have.lengthOf(10);
                expect(res.body.meta.totalRecords).to.equal(1546);
            })
            .end(done)
    });
    it('page size 20 should give 20 records', function testPath(done) {
        request(server)
            .get('/file/access_log')
            .query({page: 2,size:20})
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records).to.have.lengthOf(20);
                expect(res.body.meta.totalRecords).to.equal(1546);
            })
            .end(done)
    });
    it('out of limit page size must give 0 records', function testPath(done) {
        request(server)
            .get('/file/access_log')
            .query({page: 100,size:20})
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records).to.have.lengthOf(0);
                expect(res.body.meta.totalRecords).to.equal(1546);
            })
            .end(done)
    });
    it('100 pagesize should give max 100 records', function testPath(done) {
        request(server)
            .get('/file/log')
            .query({page: 1,size:100})
            .expect('Content-Type', /json/)
            .expect(function (res) {
                expect(res.body.records.length).to.be.at.most(100);
                expect(res.body.meta.totalRecords).to.equal(50);
            })
            .end(done)
    });

})