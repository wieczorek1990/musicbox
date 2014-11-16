var player;
var spinner;
var mute = false;

// Handlebars

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
            if (index != artists.length - 1) {
                artistsString += ', ';
            }
        }
        artistsString += ' - ';
    }
    return artistsString + track.title + ' (' + Handlebars.helpers.time(track.duration) + ')';
});

// Core

function initAudio() {
    new Audio5js({
        swf_path: './player.swf',
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

function changeCurrent() {
    $.get('/current', function (track) {
        var $player = $('#player');
        if (track) {
            $player.html(Handlebars.templates.player({track: track}));
            $('#mute').click(changeMute);
            initAudio();
        }
    });
}

function changeTracks() {
    $.get('/tracks', function (tracks) {
        $('#tracks').html(Handlebars.templates.track({tracks: tracks}));
    });
}

function setMute(value) {
    mute = value;
    var volume = mute ? 0 : 1;
    var text = mute ? 'Unmute' : 'Mute';
    player.volume(volume);
    $('#mute').text(text);
}

function changeMute() {
    setMute(!mute);
}

function setupSocket() {
    var socket = io.connect('/');
    socket.on('current', changeCurrent);
    socket.on('tracks', changeTracks);
}

// Front

function makeFileInput() {
    $('#file-input').html(Handlebars.templates['file-input']());
    $('input[type=file]').bootstrapFileInput();
    $('.file-inputs').bootstrapFileInput();
}

function setupFront() {
    var $form = $('#form');
    $form.ajaxForm({
        uploadProgress: function (event, position, total, percent) {
            if (percent == 100) {
                $form[0].reset();
                makeFileInput();
                spinner.stop();
            }
        }
    });
    $('#submit').click(function () {
        if (!spinner) {
            spinner = new Spinner().spin(document.body);
        } else {
            spinner.spin();
        }
    });
    makeFileInput();
    changeCurrent();
    changeTracks();
}

$(document).ready(function () {
    setupFront();
    setupSocket();
});