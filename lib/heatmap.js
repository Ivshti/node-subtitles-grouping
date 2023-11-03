var _ = require("underscore");

var DEFUALT_USE_BOOLEAN= true; // booelan vs numbers
var DEFUALT_HEATMAP_SEGMENT= 2000; // 1000 ms is very low fidelity, 4000 seems to be sufficient
var DEFUALT_MAX_HEATMAP_LEN= Math.round(5 * 60 * 60 * 1000 / DEFUALT_HEATMAP_SEGMENT); // assume max is 5 hours

function getHeatmap(tracks, opts = {}) {
    const USE_BOOLEAN = opts.USE_BOOLEAN || DEFUALT_USE_BOOLEAN;
    const HEATMAP_SEGMENT = opts.HEATMAP_SEGMENT || DEFUALT_HEATMAP_SEGMENT;
    const MAX_HEATMAP_LEN = opts.MAX_HEATMAP_LEN || DEFUALT_MAX_HEATMAP_LEN;

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
