var assert = require("chai").assert;
var http = require("http");
var retrieve = require("../lib/retriever").retrieveSrt;

describe("retriever HTTP encoding", function() {
	var subtitle = "1\n00:00:01,000 --> 00:00:05,000\nČ Ć Đ Š Ž é è ï à\n\n";
	var latinSubtitle = "1\n00:00:01,000 --> 00:00:05,000\nC'était déjà l'été. François était très fatigué, mais heureux d'être arrivé à la maison.\n\n";
	var cases = [
		{
			name: "preserves UTF-8 without a BOM when text/plain has no charset",
			contentType: "text/plain",
			body: Buffer.from(subtitle, "utf8"),
			expected: subtitle
		},
		{
			name: "preserves UTF-8 with an explicit charset",
			contentType: "text/plain; charset=utf-8",
			body: Buffer.from(subtitle, "utf8"),
			expected: subtitle
		},
		{
			name: "decodes Latin-1 subtitles",
			contentType: "text/plain; charset=iso-8859-1",
			body: Buffer.from(latinSubtitle, "latin1"),
			expected: latinSubtitle
		},
		{
			name: "decodes UTF-16LE subtitles with a BOM",
			contentType: "application/x-subrip",
			body: Buffer.from("\ufeff" + subtitle, "utf16le"),
			expected: subtitle
		}
	];
	var server;

	before(function(done) {
		server = http.createServer(function(req, res) {
			var fixture = cases[parseInt(req.url.slice(1), 10)];
			res.setHeader("Content-Type", fixture.contentType);
			res.end(fixture.body);
		});
		server.once("error", done);
		server.listen(0, "127.0.0.1", done);
	});

	after(function(done) {
		server.close(done);
	});

	cases.forEach(function(fixture, index) {
		it(fixture.name, function(done) {
			var url = "http://127.0.0.1:" + server.address().port + "/" + index + ".srt";
			retrieve(url, function(err, text) {
				if (err) return done(err);
				assert.strictEqual(text, fixture.expected);
				done();
			});
		});
	});
});
