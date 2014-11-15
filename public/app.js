Handlebars.registerHelper('plusOne', function(value) {
    return value + 1;
});

Handlebars.registerHelper('time', function(value) {
    var minutes = Math.floor(value / 60);
    var seconds = value % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
});

$(document).ready(function () {
    var current = {
        title: 'Current',
        duration: 160
    };
    var tick = 149;
    var tracks = [
        {
            title: 'First',
            duration: 129
        },
        {
            title: 'Second',
            duration: 139
        }
    ];
    $('#player').html(Handlebars.templates.player({track: current, tick: tick}));
    $('#tracks').html(Handlebars.templates.track({tracks: tracks}));
    $('input[type=file]').bootstrapFileInput();
    $('.file-inputs').bootstrapFileInput();
});