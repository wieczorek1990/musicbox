var express = require('express');
var multer = require('multer');
var Datastore = require('nedb');
var dbh = require('./dbh.js');

var app = express();
var db = {
    counters: new Datastore({filename: 'db/counters.db', autoload: true}),
    tracks: new Datastore({filename: 'db/tracks.db', autoload: true})
};
var port = 8080;

app.use(express.static(__dirname + '/public'));

app.use(multer({dest: './tracks/'}));

app.post('/', function (req, res) {
    if (req.files) {
        dbh.getNextSequence(db.counters, 'track_id', function (id) {
            db.tracks.insert({
                _id: id,
                title: req.body.title,
                path: req.files.track.path
            });
            res.redirect('back');
        });
    }
});

var server = app.listen(port, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:%s', port);
    dbh.remove([db.counters, db.tracks]);
    dbh.initCounters(db.counters);
});