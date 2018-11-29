
#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git add build
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER [skip ci]"
}

upload_files() {
  git remote add secret https://${SECRET_KEY}@github.com/grapenut/mush-portal.git > /dev/null 2>&1
  git push --quiet --set-upstream secret master
}

setup_git
commit_website_files
upload_files

