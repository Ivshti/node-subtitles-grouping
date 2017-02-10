var SECOND = 1000
    , MINUTE = 60 * SECOND
    , HOUR = 60 * MINUTE;


var fs = require("fs");
function parseFile(path, cb) {
    fs.readFile(path, function(err, buf) {
        if (err) return cb(err);
        try { cb(null, parseString(buf.toString())) } catch (e) { cb(e) }
    });
}

function parseString(stringData) {
    var segments = (stringData || "").split((stringData.search("\n\r\n") != -1) ? "\n\r\n" : "\n\n" );
    var memo = segments.reduce(createSrtData, [])
    return memo
}

function createSrtData(memo, string) {
    var lines = string.split("\n")

    // polyfill vtt/srt
    if (!lines[0].match(" --> ")) {
        lines.shift()
    }
    
    if (lines.length < 2) {
        return memo
    }

    var times = lines[0].split(" ") // split on intervals because if we split on --> we have a chance of added coordinates mixing into the system
        , startTime = parseTime(times[0])
        , endTime = parseTime(times[2])
        , text = lines.slice(1).join("\n")

    memo.push({
        number: memo.length, startTime: startTime, endTime: endTime
        , text: text
    })

    return memo
}

function parseTime(timeString) {
    if (! timeString) return Infinity;
    var chunks = timeString.split(":");
    if (chunks.length != 3) return Infinity;

    var secondChunks = chunks[2].split(/,|\./)
        , hours = parseInt(chunks[0], 10)
        , minutes = parseInt(chunks[1], 10)
        , seconds = parseInt(secondChunks[0], 10)
        , milliSeconds = parseInt(secondChunks[1], 10)

    return HOUR * hours +
        MINUTE * minutes +
        SECOND * seconds +
        milliSeconds
}

module.exports = { parseString: parseString, parseFile: parseFile  };
