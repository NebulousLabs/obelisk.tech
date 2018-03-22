#!/usr/bin/env bash
set -e

rm -rf release/
cd presale-sc1
npm run build
cd ../
cd presale-dcr1
npm run build
cd ../
mkdir release/
cp index.html release/
cp about.html release/
cp colocation.html release/
cp preorder.html release/
cp -r assets release/
cp -r presale-sc1/build release/presale-sc1
cp -r presale-dcr1/build release/presale-dcr1
cp -r js release/
