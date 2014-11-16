musicbox
========

Simple jukebox

## Using:

* docker
* socket.io
* nodejs
* express
* multer
* nedb
* musicmetadata
* wav
* lame
* jQuery
* bootstrap
* bootstrap-file-input
* audio5js
* spinjs
* sox
* handlebars

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

## Bugs

Upload fires itself again after ~2 minutes...