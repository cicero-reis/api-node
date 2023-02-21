FROM node:16.17.1

ARG user=node
ARG uid=1000

RUN groupmod -g $uid $user && usermod -u $uid -g $uid $user

USER $user
