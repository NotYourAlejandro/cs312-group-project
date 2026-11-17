#!/bin/bash

for d in client server .; do
    OLDPWD="$PWD"
    cd $d
    npm install
    cd $OLDPWD
done
