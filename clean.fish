#!/usr/bin/env fish
set script (status -f)
set dir (dirname $script)
cd $dir
sudo rm -f tracks/* db/*