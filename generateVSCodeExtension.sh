#!/bin/sh
npm run build
rsync -r build/ VSCodeExtension/GithubActionEditorBuild
cd VSCodeExtension || exit
npm ci
npx vsce package
cd ..
