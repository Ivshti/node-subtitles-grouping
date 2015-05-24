# subtitles-grouping
Groups subtitles (srt files) by sync. Useful when retrieving results from OpenSubtitles.

Why?
-----
OpenSubtitles has two ways of matching subtitles: metadata (e.g. IMDB ID) and movieHash. While the first one looks subtitles for a particular movie or TV episode, the second method retrieves them for a specific video.

Obviously, matching by MovieHash is the much better method since it ensures the subtitles will be synced to that particular video file.

However, there are users in OpenSubtitles who upload subtitles for a particular video file but *with wrong sync*. This is where grouping the subtitles by sync helps.

The basic philosophy is that once we have the subtitles grouped, we select the group that has the most MovieHash matches in it. As long as most MovieHash matches are correct (always), this is the right sync group for that video. That way we weed out the "odd" subtitles and we also pick the correctly synced subtitles from the metadata-based matches (usually 80% of the matches).


API
-----
```javascript
var groupSubtitles = require("subtitles-grouping");

groupSubtitles([
	{ id: "3562019", uri: "http://dl.opensubtitles.org/en/download/filead/src-api/vrf-52c7037c6b/sid-vo81ml26hrarcsciua7gd44ta6/1952189414.gz" },
	{ id: "3963807", uri: "./examples/dexter-4x1/3963807.srt" },
	{ id: "3567323": uri: "./examples/dexter-4x1/3567323.srt" },
	{ id: "3562666": uri: "./examples/dexter-4x1/3562666.srt" }
], function(err, groups) { console.log(groups) }, { /* OPTIONS agent, sensitivity */  });

// subtitles URI is a URL/local path to an srt file, gzip-compressed srt or a zip containing an srt

// groups will be an array of the groups, each group being an array of subtitles as given to groupSubtitles() but also with a ``.heatmap`` property

// see example/example.js
```

Other modules
-------
```javascript
// Retrieves an srt string from path/URL to srt, gz or zip
// Also converts encoding to UTF8
require("./lib/retriever").retrieveSrt(/* path/URL to an srt, gz or zip file */, function(err,buf) {  })`` 

// Builds a heatmap of an srt file
require("./lib/heatmap")(/* string in a srt format */) //returns an array heatmap of that srt
```



CLI
-----
**TODO**
