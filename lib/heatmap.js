var _ = require("underscore");

var USE_BOOLEAN = true; // booelan vs numbers
var HEATMAP_SEGMENT = 2000; // 1000 ms is very low fidelity, 4000 seems to be sufficient
var MAX_HEATMAP_LEN = Math.round(5*60*60*1000 / HEATMAP_SEGMENT); // assume max is 5 hours

function getHeatmap(tracks) {
    var heatmap = [];
    _.each(tracks, function(track) {
        var idxStart = Math.floor(track.startTime / HEATMAP_SEGMENT), idxEnd = Math.ceil(track.endTime / HEATMAP_SEGMENT);
        idxEnd = Math.min(MAX_HEATMAP_LEN, idxEnd); /* Protection - sometimes we have buggy tracks which end in Infinity */

        for (var i=idxStart; i<idxEnd; i++) {
          if (i<0) continue;
          if (! heatmap[i]) heatmap[i] = 0;
          USE_BOOLEAN ? heatmap[i] = 1 : heatmap[i]++;
        }
    });

    /* Heatmap: Fill in the blanks */
    for (var i = 0; i!=heatmap.length; i++) 
      if (! heatmap[i]) heatmap[i] = 0;   

    return heatmap;
}
module.exports = getHeatmap;
