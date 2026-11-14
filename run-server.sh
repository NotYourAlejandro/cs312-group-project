#!/usr/bin/env bash

root="$(dirname "$0")"

cd "$root/client" && npm run start &
cd "$root/server" && npm run dev &
wait

