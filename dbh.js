exports.print = function (dbs) {
    if (!(dbs instanceof Array)) {
        dbs = [dbs];
    }
    for (var index in dbs) {
        var db = dbs[index];
        db.find({}, function (err, docs) {
            console.log(docs);
        })
    }
};

exports.remove = function (dbs) {
    if (!(dbs instanceof Array)) {
        dbs = [dbs];
    }
    for (var index in dbs) {
        var db = dbs[index];
        db.remove({}, {multi: true});
    }
};

exports.initCounters = function (counters) {
    counters.insert({_id: "track_id", seq: 0});
};

exports.getNextSequence = function (counters, name, callback) {
    counters.update(
        {_id: name},
        {$inc: {seq: 1}},
        {},
        function (err, newDoc) {
            callback(newDoc);
        }
    );
};