var stream = require("stream");
var needle = require("needle");
var fs = require("fs");
var iconv = require("iconv-lite");
var unzip = require("unzip");
var charsetDetector = require("jschardet");
var zlib = require("zlib");
var _ = require("lodash");

function streamFromPath(path, agent)
{
	if (path instanceof stream.Readable) return path;
	if (path.match("^http")) return needle.get(path, { agent: agent });
	return fs.createReadStream(path);
};

function retrieveSrt(path, cb, options)
{
    var callback = _.once(function(err, res) {
        if (err && options && options.agent) return retrieveSrt(path, cb); // Re-try without agent
        cb(err, res);
    });
    
	var stream = streamFromPath(path, options && options.agent);
    stream.on("error", function(err) { callback(err) });
    if (path.match("zip$")) {
        var foundSrt = false, bufs = [];
        stream.pipe(unzip.Parse())
        .on("entry", function(entry) {
            // TODO: think about the case when we find multiple srt's; currently this is an unseen case
            if (!entry.path.match("srt$") || foundSrt) return;
            foundSrt = true;
            entry.on("data", function(dat) { bufs.push(dat) });
            entry.on("end", onDownloaded);
            entry.on("error", function(e) { callback(e) });
        })
        .on("error", function(e) { callback(e) })
        .on("close", function() {
            if (! foundSrt) { callback(new Error("no srt found in zip file "+path)); }
        });
    } else {
        if (path.match("gz$")) var stream = stream.pipe(zlib.createUnzip());
        var bufs = [];
        stream.on("data", function(dat) { bufs.push(dat) })
        stream.on("end", onDownloaded);
        stream.on("error", function(e) { callback(e) });                
    }

    function onDownloaded() {
        //if (! bufs.length) HANDLE ERROR

        var buf = Buffer.concat(bufs);

        var charset = charsetDetector.detect(buf).encoding;
        try { buf = iconv.decode(buf, charset) } catch(e) { callback(e); return };

        callback(null, buf);           
    };    
};

module.exports = {
	streamFromPath: streamFromPath,
	retrieveSrt: retrieveSrt,
};
