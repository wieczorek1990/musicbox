var Datastore = require('nedb');
var dbh = require('./dbh.js');

var db = {
    counters: new Datastore({filename: 'db/counters.db', autoload: true}),
    tracks: new Datastore({filename: 'db/tracks.db', autoload: true})
};

dbh.remove([db.counters, db.tracks]);
db.counters.insert({_id: "track_id", seq: 0});
dbh.print([db.counters, db.tracks]);
dbh.getNextSequence(db.counters, 'track_id', function (id) {
    db.tracks.insert({
        id: id,
        title: 'test',
        path: 'tracks/dsafdsa.mp3'
    });
    dbh.print([db.counters, db.tracks]);
});