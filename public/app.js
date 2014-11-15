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

var lastTrackId;

function changeCurrent() {
    console.log('changeCurrent');
    $.get('/current', function (track) {
        $player = $('#player');
        if (track) {
            if (lastTrackId != track._id) {
                $player.html(Handlebars.templates.player({track: track}));
                $('#mute').click(changeState);
                lastTrackId = track._id;
            }
        }
    });
}

function changeTracks() {
    console.log('changeTracks');
    $.get('/tracks', function (tracks) {
        $('#tracks').html(Handlebars.templates.track({tracks: tracks}));
        if (!lastTrackId) {
            changeCurrent();
        }
    });
}

function makeFileInput() {
    $('#file-input').html(Handlebars.templates['file-input']());
    $('input[type=file]').bootstrapFileInput();
    $('.file-inputs').bootstrapFileInput();
}

function changeState(e) {
    var $self = $(e.target);
    var audio = $('audio')[0];
    if ($self.data('state') == 'on') {
        audio.muted = true;
        $self.data('state', 'off');
        $self.text('Unmute');
    } else {
        audio.muted = false;
        $self.data('state', 'on');
        $self.text('Mute');
    }
}

function setupForm() {
    $('#form').ajaxForm();
}

$(document).ready(function () {
    setupForm();
    makeFileInput();
    changeCurrent();
    changeTracks();
    var socket = io.connect('/');
    socket.on('done', makeFileInput);
    socket.on('current', changeCurrent);
    socket.on('tracks', changeTracks);
});