var debug = true;
var mute = false;
var player;
var tracksEmpty = true;

// Helpers

function log() {
    if (debug) {
        console.log.apply(console, arguments);
    }
}

Handlebars.registerHelper('plusOne', function (value) {
    return value + 1;
});

Handlebars.registerHelper('time', function (value) {
    var minutes = Math.floor(value / 60);
    var seconds = value % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
});

Handlebars.registerHelper('description', function (track) {
    var artists = track.artist;
    var artistsString = '';
    if (artists.length) {
        for (var index in artists) {
            artistsString += artists[index];
            if (index < artists.length - 1) {
                artistsString += ', ';
            }
        }
        artistsString += ' - ';
    }
    return artistsString + track.title + ' (' + Handlebars.helpers.time(track.duration) + ')';
});

Handlebars.registerHelper('left', function (left) {
    return 'Time left: ' + Handlebars.helpers.time(left);
});

// Core

function setMute(value) {
    mute = value;
    var volume = mute ? 0 : 1;
    var text = mute ? 'Unmute' : 'Mute';
    player.volume(volume);
    $('#mute').text(text);
}

function initAudio() {
    log('initAudio');
    new Audio5js({
        swf_path: './vendor/swf/audio5js.swf',
        throw_errors: true,
        format_time: true,
        ready: function () {
            player = this;
            this.load('/stream');
            this.play();
            setMute(mute);
        }
    });
}

function changeMute() {
    setMute(!mute);
}

function changeCurrent() {
    log('changeCurrent');
    $.get('/current', function (track) {
        var $player = $('#player');
        if (track) {
            if (tracksEmpty) {
                tracksEmpty = false;
            }
            $player.html(Handlebars.templates.player({track: track}));
            $('#mute').click(changeMute);
            initAudio();
        }
    });
}

function changeTracks() {
    log('changeTracks');
    $.get('/tracks', function (tracks) {
        tracksEmpty = tracks.length === 0;
        $('#tracks').html(Handlebars.templates.track({tracks: tracks, tracksEmpty: tracksEmpty}));
    });
}

function changeLeft(left) {
    $('#left').text(Handlebars.helpers.left(left));
}

function setupSocket() {
    var socket = io.connect('/');
    socket.on('current', changeCurrent);
    socket.on('tracks', changeTracks);
    socket.on('left', changeLeft);
}

// Front

function makeFileInput() {
    $('#file-input').html(Handlebars.templates['file-input']());
    $('input[type=file]').bootstrapFileInput();
    $('.file-inputs').bootstrapFileInput();
}

function bindSubmit() {
    $('#submit').click(function () {
        new Spinner().spin(document.body);
    });
}

function setupFront() {
    bindSubmit();
    makeFileInput();
    changeCurrent();
    changeTracks();
}

$(document).ready(function () {
    setupFront();
    setupSocket();
});