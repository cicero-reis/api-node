#!bin/bash

openssl req -x509 -nodes -newkey rsa:2048 -keyout cert.key -out cert.crt -days 365