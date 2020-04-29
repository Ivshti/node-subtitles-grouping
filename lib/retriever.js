var stream = require("stream");
var needle = require("needle");
var fs = require("fs");
var iconv = require("iconv-lite");
var charsetDetector = require("charset-detector");
var zlib = require("zlib");
var zip = require("zip");
var _ = require("underscore");

function streamFromPath(path, agent)
{
	if (path instanceof stream.Readable) return path;
	if (path.match("^http")) return needle.get(path, { agent: agent, follow_max: 12 });
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

        var zipbufs = [];
        stream.on("data", function(b) { zipbufs.push(b) });
        stream.on("end", function() {
            try {
                zip.Reader(Buffer.concat(zipbufs)).forEach(onEntry);
            } catch(e) { return callback(e) }

            function onEntry(entry) {
                if (!entry.getName().match("srt$") || foundSrt) return;
                foundSrt = true;
                bufs.push(entry.getData());
            }
            
            if (!foundSrt) return callback(new Error("no srt found in zip file "+path));
            onDownloaded();
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

        var charset;
        try {
               if (options && options.charset && options.charset != "auto") charset = options.charset;
               else charset = charsetDetector(buf)[0].charsetName;

               // handles a special case where ISO-8859-8 IANA is detected
               // which iconv-lite does not support directly:
               charset = charset == 'ISO-8859-8-I' ? 'ISO-8859-8' : charset

               buf = iconv.decode(buf, charset) 
        } catch(e) { callback(e); return };

        callback(null, buf);           
    };    
};

module.exports = {
	streamFromPath: streamFromPath,
	retrieveSrt: retrieveSrt,
};
