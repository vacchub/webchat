#!/bin/bash

if [ -z "$1" ]
then
    echo "git_backup.sh version"
	exit
fi

cd /proj/git

# download
#git pull origin master

git add /proj/webchat/index.html /proj/webchat/was.js

git commit -m "$1"
git remote add origin https://github.com/vacchub/webchat.git

# upload
git push -u origin master

