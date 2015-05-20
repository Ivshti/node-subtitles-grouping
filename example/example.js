#!/usr/bin/env node

var _ = require("lodash");
var jade = require("jade");
var fs = require("fs");

var grouper = require("../index");

// second, third are wrong - from the first five
var movieHashPicks = ["3562019","3963807","3551160","4406605","4115696","3897611","3900200","3852049","3826208","4749038","4769040","3732301","4321763","4028297","4773282","4904207","4147784","4601329","4784905","5446140","4607272","5427898","5867324"];

// First 5 movie hash picks
var firstPicks = movieHashPicks.slice(0,5);

// First 3 english; only the second one is correct
var english = ["3562019", "3963807", "3567323"];

// First 2 bulgarianp; first one is incorrect
var bulgarian = ["3748898", "5522590"];


//var correct = ["5522590", "3963807"];

var GROUP_COLORS = ["red", "green", "brown", "purple", "cyan", "blue"];
var template = jade.compile(fs.readFileSync("./example/subtitles.jade").toString(), {});

var subs = _.uniq(firstPicks.concat(english).concat(bulgarian));
grouper(subs.map(function(x) { 
	return { 
		uri: "./example/dexter-4x1/"+x+".srt",
		id: x,
		moviehash_pick: movieHashPicks.indexOf(x) > -1 
	}
}), function(err, groups) {
	if (err) console.error(err);

	console.log(groups);

	// Sort groups by number of moviehash picks
	var results = groups.map(function(group) { 
		group.moviehash_len = group.filter(function(x) { return x.moviehash_pick }).length;
		return group;
	})
	.sort(function(a,b) { 
		return b.moviehash_len - a.moviehash_len;
	})
	// Assign colours to each group
	.map(function(g,i) {
		g.forEach(function(s) { 
			s.color = GROUP_COLORS[i] || "black"; 
		});
		return g;
	});

    fs.writeFile("./example/index.html", template({ subtitles: _.flatten(results) }));
    console.log("Generated a visualization at example/index.html - "+require("path").resolve("./example/index.html"));
})