#!/bin/bash

set -eu

echo "=> Ensure directories"
mkdir -p /app/data/

echo "=> Accept EULA"
echo "eula=true" > /app/data/eula.txt

if [[ -f /app/data/server.properties ]]; then
    echo "=> Update server port"
    sed -e "s/server-port.*/server-port=${SERVER_PORT}/" -i /app/data/server.properties
fi

echo "=> Ensure permissions"
chown -R cloudron:cloudron /app/data

echo "=> Starting management server"
exec /usr/local/bin/gosu cloudron:cloudron node /app/code/index.js
