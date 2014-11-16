var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exec = require('child_process').exec;
var fs = require('fs');
var multer = require('multer');
var mm = require('musicmetadata');
var nedb = require('nedb');
var dbh = require('./dbh.js');

var db = {
    tracks: new nedb({filename: 'db/tracks.db', autoload: true}),
    current: new nedb({filename: 'db/current.db', autoload: true})
};
var debug = true;
var current;
var soxDelay = 5;
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

function ms(seconds) {
    return seconds * 1000;
}

function empty(hash) {
    return Object.keys(hash).length === 0
}

function findLater(callback) {
    db.tracks.find({timestamp: {$gt: current.track.timestamp}}).sort({timestamp: 1}).exec(callback);
}

// Core

function addTrack(req, callback) {
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
        db.tracks.insert({
            path: path,
            timestamp: (new Date()).getTime(),
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
}

function setCurrent(docs, callback) {
    var doc = docs[0];
    db.current.insert({track: doc}, function (err, doc) {
        current = doc;
        io.emit('current');
        if (callback) {
            callback();
        }
    });
}

function initCurrent(callback) {
    db.tracks.find().sort({timestamp: 1}).limit(1).exec(function (err, docs) {
        if (docs.length) {
            setCurrent(docs, callback);
        }
    });
}

function nextCurrent(callback) {
    findLater(function (err, docs) {
        if (!docs.length) {
            initCurrent(callback);
        } else {
            setCurrent(docs, callback);
        }
    });
}

function startStream(res, path) {
    var reader = fs.createReadStream(path);
    reader.pipe(res);
}

function stream(res) {
    var inputPath = current.track.path;
    var filename = inputPath.replace(/^tracks\//, '');
    var outputPath = 'tracks/trimmed/' + filename;
    var extension = inputPath.split('.').pop();
    var type = 'audio/' + (extension === 'mp3' ? 'mpeg' : 'ogg');
    res.set({
        'Content-Type': type,
        'Transfer-Encoding': 'chunked'
    });
    if (tick !== 0) {
        var start = tick + soxDelay;
        var command = 'sox ' + inputPath + ' ' + outputPath + ' trim ' + start;
        exec(command, function () {
            startStream(res, outputPath);
        });
    } else {
        startStream(res, inputPath);
    }
}

function start() {
    var clock;

    function init() {
        tick = 0;
        info();
        clock = setInterval(nextTick, ms(1));
        setTimeout(nextTrack, ms(current.track.duration));
    }

    function nextTick() {
        tick += 1;
        info();
    }

    function nextTrack() {
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

// Didn't work with other route
app.post('/', function (req, res) {
    if (!empty(req.files)) {
        if (!current) {
            addTrack(req, start);
        } else {
            addTrack(req);
        }

    } else {
        res.redirect('back');
    }
});

server.listen(8080, function () {
    log('Listening at http://localhost:%s', server.address().port);
    if (process.argv[2] === 'clean') {
        dbh.remove(db.tracks);
    }
    start();
});