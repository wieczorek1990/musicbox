var Datastore = require('nedb');
var dbh = require('./dbh.js');

var db = {
    counters: new Datastore({filename: 'db/counters.db', autoload: true}),
    current: new Datastore({filename: 'db/current.db', autoload: true}),
    tracks: new Datastore({filename: 'db/tracks.db', autoload: true})
};

//dbh.remove([db.counters, db.tracks]);
//db.counters.insert({_id: "track_id", seq: 0});
dbh.print([db.counters, db.current, db.tracks]);
//dbh.getNextSequence(db.counters, 'track_id', function (id) {
//    db.tracks.insert({
//        id: id,
//        title: 'test',
//        path: 'tracks/dsafdsa.mp3'
//    });
//    dbh.print([db.counters, db.tracks]);
//});
//db.tracks.find().sort({timestamp: 1}).limit(1).exec(function (err, docs) { // find first
//    var doc = docs[0];
//    console.log('first: ' + JSON.stringify(doc));
//    if (doc) { // set first as current
//        db.current.insert({_id: 0, current: doc}, function (err, doc) {
//            console.log('inserted: ' + JSON.stringify(doc));
//        });
//    }
//});
//db.tracks.find().sort({timestamp: 1}).exec(function(err, docs) {
//    var current = docs[0];
//    db.tracks.find({timestamp: {$gt: current.timestamp}}).sort({timestamp: 1}).exec(function (err, docs) {
//        for (var index in docs) {
//            var doc = docs[index];
//            console.log(doc);
//        }
//    });
//});