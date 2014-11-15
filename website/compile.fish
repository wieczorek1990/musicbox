#!/usr/bin/env fish
set script (status -f)
set dir (dirname $script)
cd $dir
set names track player
for name in $names
    handlebars $name.handlebars -f $name.compiled.js
end