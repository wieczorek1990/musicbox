#!/usr/bin/env fish
set script (status -f)
set dir (dirname $script)
cd $dir/public/
set names track player file-input
for name in $names
    handlebars hbs/$name.handlebars -f js/$name.compiled.js
end