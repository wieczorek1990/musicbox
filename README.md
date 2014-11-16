musicbox
========

Simple jukebox

## Using:

* docker - portability
* jQuery - dom manipulation, events
* bootstrap - css
* bootstrap-file-input - file input styling
* audio5js - audio tag replacement
* handlebars - templates
* spinjs - spinner
* socket.io - events
* nodejs - server
* express - routes
* multer - uploads
* nedb - file database
* musicmetadata - audio metadata
* wav - wav info
* lame - audio encoder
* sox - audio decoder

## Running:

Docker:

```shell
git clone git@github.com:wieczorek1990/musicbox.git
cd musicbox
sudo docker build -t wieczorek1990/musicbox .
sudo docker run -p 80:80 wieczorek1990/musicbox
google-chrome http://localhost
```

Locally:

```shell
git clone git@github.com:wieczorek1990/musicbox.git
cd musicbox
sudo node index.js [clean]
```

If you pass clean as first argument databases will be removed.

## Scripts:
`clean.fish` - clean db and tracks directories,

 `compile.fish` - compile handlebars templates.