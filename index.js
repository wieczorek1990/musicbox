var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exec = require('child_process').exec;
var fs = require('fs');
var lame = require('lame');
var multer = require('multer');
var mm = require('musicmetadata');
var nedb = require('nedb');
var wav = require('wav');
var dbh = require('./dbh.js');

var db = {
    tracks: new nedb({filename: 'db/tracks.db', autoload: true}),
    current: new nedb({filename: 'db/current.db', autoload: true})
};
var debug = true;
var current;
//var ips = [];
var tick;

// Helpers

function log() {
    if (debug) {
        console.log.apply(console, arguments);
    }
}

function info() {
    log('tick: ' + tick + ', title: ' + current.track.title);
}

function time() {
    return (new Date()).getTime();
}

function ms(seconds) {
    return seconds * 1000;
}

function empty(hash) {
    return Object.keys(hash).length === 0
}

function findLater(callback) {
    db.tracks.find({timestamp: {$gt: current.track.timestamp}}).sort({timestamp: 1}).exec(callback);
}

function wavPath(path) {
    return path.replace(/\.[^.]+$/, '.wav');
}

function calculateStart(path, format) {
    var size = fs.statSync(path, 'r').size;
    var byteRate = format.byteRate;
    var headerLength = size % byteRate;
    return headerLength + tick * byteRate;
}

// Core

function decode(inputPath, callback) {
    var outputPath = wavPath(inputPath);
    var command = ['sox', inputPath, '-t sndfile', outputPath].join(' ');
    exec(command, callback);
}

function addTrack(req, callback) {
    log('addTrack');
    var path = req.files.track.path;
    var parser = mm(fs.createReadStream(path), {duration: true});
    parser.on('metadata', function (meta) {
        var title;
        if (meta.title) {
            title = meta.title;
        } else if (req.body.title) {
            title = req.body.title;
        } else {
            title = path.replace(/.*\//, '');
        }
        decode(path, function () {
            db.tracks.insert({
                path: wavPath(path),
                timestamp: time(),
                artist: meta.artist,
                duration: meta.duration,
                title: title
            }, function () {
                if (callback) {
                    callback(function () {
                        io.emit('tracks');
                    });
                } else {
                    io.emit('tracks');
                }
            });
        });
    });
}

function setCurrent(docs, callback) {
    log('setCurrent');
    var doc = docs[0];
    db.current.insert({track: doc}, function (err, doc) {
        current = doc;
        io.emit('current');
        io.emit('tracks');
        if (callback) {
            callback();
        }
    });
}

function initCurrent(callback) {
    log('initCurrent');
    db.tracks.find().sort({timestamp: 1}).limit(1).exec(function (err, docs) {
        if (docs.length) {
            setCurrent(docs, callback);
        }
    });
}

function nextCurrent(callback) {
    log('nextCurrent');
    findLater(function (err, docs) {
        if (!docs.length) {
            initCurrent(callback);
        } else {
            setCurrent(docs, callback);
        }
    });
}

function stream(res) {
    log('stream');
    var path = current.track.path;
    var file = fs.createReadStream(path);
    var reader = new wav.Reader();
    res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
    });
    reader.on('format', function (format) {
        file.unpipe();
        reader.end();
        var start = calculateStart(path, format);
        var f = fs.createReadStream(path, {start: start});
        var encoder = new lame.Encoder(format);
        f.pipe(encoder).pipe(res);
    });
    file.pipe(reader);
}

function left() {
    io.emit('left', current.track.duration - tick);
}

function start() {
    log('start');
    var clock;

    function init() {
        log('init');
        tick = 0;
        left();
        info();
        clock = setInterval(nextTick, ms(1));
        setTimeout(nextTrack, ms(current.track.duration));
    }

    function nextTick() {
        tick += 1;
        left();
        info();
    }

    function nextTrack() {
        log('nextTrack');
        //ips = [];
        if (clock) {
            clearInterval(clock);
        }
        if (current) {
            nextCurrent(init);
        } else {
            initCurrent(init);
        }
    }

    nextTrack();
}

// Express

app.use(express.static('./public'));

app.use(multer({dest: './tracks/'}));

app.get('/current', function (req, res) {
    if (current) {
        res.json(current.track);
    }
});

app.get('/tracks', function (req, res) {
    if (current) {
        findLater(function (err, docs) {
            res.json(docs);
        });
    }
});

app.get('/stream', function (req, res) {
    stream(res);
});

// TODO Doesnt't work with other routes: "Cannot POST /"
app.post('/', function (req, res) {
    function redirect() {
        res.redirect('back');
    }

    if (!empty(req.files)) {
        if (!current) {
            addTrack(req, function () {
                start();
                redirect();
            });
        } else {
            addTrack(req, redirect);
        }
    } else {
        redirect();
    }
});

server.listen(80, function () {
    var message = 'Listening at http://localhost';
    var port = server.address().port;
    if (port !== 80) {
        message += ':%s';
        log(message, port);
    } else {
        log(message);
    }
    if (process.argv[2] === 'clean') {
        dbh.remove([db.current, db.tracks]);
    }
    start();
});