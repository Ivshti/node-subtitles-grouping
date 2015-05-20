var retriever = require("./lib/retriever");
var getHeatmap = require("./lib/heatmap");
var srt = require("./lib/srt");
var grouping = require("./lib/grouping");

var async = require("async");

module.exports = function grouper(subs, callback) {
	subs = subs.map(function(x, i) { 
		if (typeof(x) == "string") return { uri: x, id: i };
		return x;
	});

	async.map(subs, function(x, cb) { retriever.retrieveSrt(x.uri, cb) }, function(err, srts) {
		if (err) return callback(err);
		
		srts.forEach(function(b, i) { 
			subs[i].heatmap = getHeatmap(srt.parseString(b));
		});
		
		var groups = grouping.group(subs);
		callback(null, groups);
	});
};