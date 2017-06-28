#!/bin/bash
set -e

rm -rf release/
cd preorder
npm run build
cd ../
mkdir release/
cp index.html release/
cp -r assets/ release/
cp -r preorder/build release/preorder
cp -r js/ release/

