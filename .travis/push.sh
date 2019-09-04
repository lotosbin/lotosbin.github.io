#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout master
  git add ./_posts/ *.markdown
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
  git push
}

upload_files() {
  git remote rm origin
  git remote add origin https://${GH_USER}:${GH_TOKEN}@github.com/lotosbin/lotosbin.github.io.git > /dev/null 2>&1
  git push --quiet origin master
}

setup_git
commit_website_files
upload_files