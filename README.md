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

```shell
git clone git@github.com:wieczorek1990/musicbox.git
cd musicbox
sudo docker build -t wieczorek1990/musicbox .
sudo docker run -p 80:80 wieczorek1990/musicbox
```

## Bugs

Upload fires itself again after ~2 minutes...