# node-subtitles-grouping
Groups subtitles (srt files) by sync. Useful when retrieving results from OpenSubtitles.

Why?
-----
OpenSubtitles has two ways of matching subtitles: metadata (e.g. IMDB ID) and movieHash. While the first one looks subtitles for a particular movie or TV episode, the second method retrieves them for a specific video.

Obviously, matching by MovieHash is the much better method since it ensures the subtitles will be synced to that particular video file.

However, there are users in OpenSubtitles who upload subtitles for a particular video file but *with wrong sync*. This is where grouping the subtitles by sync helps.

The basic philosophy is that once we have the subtitles grouped, we select the group that has the most MovieHash matches in it. As long as most MovieHash matches are correct (always), this is the right sync group for that video. That way we weed out the "odd" subtitles and we also pick the correctly synced subtitles from the metadata-based matches (usually 80% of the matches).


API
-----
``.groupSubtitles([subtitle1, subtitle2, ...], function(err, groups) { })``

subtitle can be:
- URL/path to zip containing srt file (needs to end in .zip) - only first srt will be parsed
- URL/path to gz compressed srt file (needs to end in .gz)
- ReadableStream of srt file

groups will be an array of the groups, each group being an array of subtitle ids, based on their idx
e.g. `[[1,2,5],[3,4]]`


``.srtFromGz(path/url to gz file) -> readableStream to srt``
``.srtFromZip(path/url to zip file) -> readableStream to srt``
``.getHeatmap(readStream to srt)``