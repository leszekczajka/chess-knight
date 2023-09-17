#!/bin/bash

if [ "$1" = '' ]; then
    echo "";
    echo "Sposób użycia: $0 [numer_ wersji]";
    echo "";
    echo "Przykład: $0 1.0.0"
    echo "";
else
    echo "Stop current...";
    docker stop chess-knight-client;
    echo "Remove current...";
    docker rm chess-knight-client;
    echo "Run...";
    docker run \
        -d \
        -e TZ=Europe/Warsaw \
        --restart always \
        --name=chess-knight-client \
        -p 127.0.0.1:4012:80 \
        chess-knight-client:$1;
    echo "Done."
    docker ps -f name=chess-knight-client;
fi;
