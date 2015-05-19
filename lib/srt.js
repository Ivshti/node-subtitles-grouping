var SECOND = 1000
    , MINUTE = 60 * SECOND
    , HOUR = 60 * MINUTE;

function parseFromString(stringData) {
    var segments = (stringData || "").split((stringData.search("\n\r\n") != -1) ? "\n\r\n" : "\n\n" );
    return segments.reduce(createSrtData, {})
}

function createSrtData(memo, string) {
    var lines = string.split("\n")

    if (lines.length < 3) {
        return memo
    }

    var number = parseInt(lines[0], 10)
        , times = lines[1].split(" --> ")
        , startTime = parseTime(times[0])
        , endTime = parseTime(times[1])
        //, text = lines.slice(2).join("\n")

    memo[number] = {
        number: number, startTime: startTime, endTime: endTime
        //, text: text
    }

    return memo
}

function parseTime(timeString) {
    if (! timeString) return Infinity;
    var chunks = timeString.split(":");
    if (chunks.length != 3) return Infinity;

    var secondChunks = chunks[2].split(",")
        , hours = parseInt(chunks[0], 10)
        , minutes = parseInt(chunks[1], 10)
        , seconds = parseInt(secondChunks[0], 10)
        , milliSeconds = parseInt(secondChunks[1], 10)

    return HOUR * hours +
        MINUTE * minutes +
        SECOND * seconds +
        milliSeconds
}

module.exports = parseFromString;