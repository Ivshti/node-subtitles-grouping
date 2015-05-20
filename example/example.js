var _ = require("lodash");

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


var subs = _.uniq(firstPicks.concat(english).concat(bulgarian));
grouper(subs.map(function(x) { return "./example/dexter-4x1/"+x+".srt" }), function(err, groups) {
	console.log(groups)
})