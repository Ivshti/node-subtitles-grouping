var should = require("chai").should(),
	assert = require("chai").assert;

var fs = require("fs");

var parseSrt = require("../lib/srt");

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
