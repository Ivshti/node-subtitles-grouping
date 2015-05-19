var should = require("chai").should(),
	assert = require("chai").assert;

var fs = require("fs");

var parseSrt = require("../lib/srt").parseString;
var heatmap = require("../lib/heatmap");
var retrieve = require("../lib/retriever").retrieveSrt;

describe("srt", function() {
	it("parse srt file to retrieve the timestamps", function(done) {
		var tracks = parseSrt(fs.readFileSync("./test/theoffice.srt").toString());
		assert.isDefined(tracks);
		Object.keys(tracks).length.should.equal(386);
		assert.isDefined(tracks[166]);
		tracks[166].number.should.equal(166);
		tracks[166].startTime.should.equal(487250);
		tracks[166].endTime.should.equal(488546);

		done();
	});

});


describe("heatmap", function() {
	it("generate a heatmap", function(done) {
		var tracks = parseSrt(fs.readFileSync("./test/theoffice.srt").toString());
		var map = heatmap(tracks);
		assert.isTrue(Array.isArray(map));
		map.length.should.equal(623);
		done();
	});

});

// http://www.yifysubtitles.com/subtitle-api/american-psycho-yify-10962.zip
// http://dl.opensubtitles.org/en/download/filead/src-api/vrf-07a4118f99/sid-hde04ngpuvva7nqkddrukas676/1952452279.gz
describe("retriever", function() {
	it("retrieve srt (local file)", function(done) {
		// TODO
		done();
	});

	it("retrieve srt from zip", function(done) {
		retrieve("http://www.yifysubtitles.com/subtitle-api/american-psycho-yify-10962.zip", function(err, sub) {
			assert.isNull(err);
			assert.isDefined(sub);
			assert.isTrue(typeof(sub)=="string");
			done();
		})
	});

	it("retrieve srt from gz", function(done) {
		// TODO
		done();
	});

	it("retrieve srt from gz (local file)", function(done) {
		// TODO
		done();
	});
});

describe("grouping", function() {

});
