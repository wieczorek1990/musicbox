var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var multer = require('multer');
var mm = require('musicmetadata');
var nedb = require('nedb');
var dbh = require('./dbh.js');

var db = {
    tracks: new nedb({filename: 'db/tracks.db', autoload: true}),
    current: new nedb({filename: 'db/current.db', autoload: true})
};
var current;

app.use(express.static('./public'));
app.use(multer({dest: './tracks/'}));

app.get('/current', function (req, res) {
    if (current) {
        res.json(current.track);
    }
});

app.get('/tracks', function (req, res) {
    if (current) {
        db.tracks.find({timestamp: {$gt: current.track.timestamp}}).sort({timestamp: 1}).exec(function (err, docs) {
            res.json(docs);
        });
    }
});

// TODO same stream for everyone
// TODO event on end of track
// TODO remove after end of track
app.get('/stream', function (req, res) {
    var path = current.track.path;
    var extension = path.split('.').pop();
    var type = extension == 'mp3' ? 'mpeg' : 'ogg';
    res.set({
        'Content-Type': 'audio/' + type,
        'Transfer-Encoding': 'chunked'
    });
    // TODO seek
    var stream = fs.createReadStream(path);
    stream.pipe(res);
});

// Didn't work with other route
app.post('/', function (req, res) {
    if (Object.keys(req.files).length != 0) {
        io.emit('done');
        if (!current) {
            addTrack(req, initCurrent);
        } else {
            addTrack(req);
        }

    } else {
        res.redirect('back');
    }
});

function addTrack(req, callback) {
    console.log('addTrack');
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

function initCurrent(callback) {
    console.log('initCurrent');
    db.tracks.find().sort({timestamp: 1}).limit(1).exec(function (err, docs) {
        var doc = docs[0];
        if (doc) {
            db.current.insert({track: doc}, function (err, doc) {
                current = doc;
                io.emit('current');
                callback();
            });
        }
    });
}

function nextCurrent() {
    console.log('nextCurrent');
    db.tracks.find({timestamp: {$gt: current.timestamp}}).sort({timestamp: 1}).exec(function (err, docs) {
        console.log('docs: ' + JSON.stringify(docs));
        if (!docs.length) {
            initCurrent();
        }
        var doc = docs[0];
        db.current.insert({track: doc}, function (err, doc) {
            console.log('inserted: ' + JSON.stringify(doc));
            current = doc;
            io.emit('current');
        });
    });
}

server.listen(8080, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:%s', port);
    dbh.remove(db.tracks);
    initCurrent();
});