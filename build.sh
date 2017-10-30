#!/bin/bash
set -e

rm -rf release/
cd preorder-sc1
npm run build
cd ../
cd preorder-dcr1
npm run build
cd ../
mkdir release/
cp index.html release/
cp about.html release/
cp colocation.html release/
cp preorder.html release/
cp -r assets release/
cp -r preorder-sc1/build release/preorder-sc1
cp -r preorder-dcr1/build release/preorder-dcr1
cp -r js release/
