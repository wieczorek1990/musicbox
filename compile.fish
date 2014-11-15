#!/usr/bin/env fish
set script (status -f)
set dir (dirname $script)
cd $dir/public/
set names track player file-input
for name in $names
    handlebars $name.handlebars -f $name.compiled.js
end