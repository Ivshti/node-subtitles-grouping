#!/usr/bin/env node

var retriever = require("./lib/retriever");
var getHeatmap = require("./lib/heatmap");
var srt = require("./lib/srt");
var grouping = require("./lib/grouping");

var async = require("async");

module.exports = function grouper(subs, callback, options) {
	subs = subs.map(function(x, i) { 
		if (typeof(x) == "string") return { uri: x, id: i };
		return x;
	});

	async.map(subs, function(x, cb) { retriever.retrieveSrt(x.uri, cb, options) }, function(err, srts) {
		if (err) return callback(err);
		
		srts.forEach(function(b, i) { 
			subs[i].heatmap = getHeatmap(srt.parseString(b));
		});
		
		var groups = grouping.group(subs, options && options.sensitivity);
		callback(null, groups);
	});
};

// CLI use
if (!module.parent) {
	module.exports(process.argv.slice(2), function(err, res) {
		if (res) res.forEach(function(g) { g.forEach(function(s) { delete s.heatmap }) });
		console.log(err || JSON.stringify(res, null, 4))
	})
}