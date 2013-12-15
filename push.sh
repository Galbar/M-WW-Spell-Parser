#/bin/sh
git checkout master
git commit -a -m "...."
git push
git checkout gh-pages
git merge master
git push
git checkout master
