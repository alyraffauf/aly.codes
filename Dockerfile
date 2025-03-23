FROM alpine:latest AS build

ARG BASEURL="https://aly.codes/"

RUN apk add --no-cache git go hugo

COPY . /site
WORKDIR /site
RUN git submodule update --init --recursive
RUN hugo build --gc --minify --baseURL ${BASEURL}

FROM nginx:alpine
WORKDIR /usr/share/nginx/html/
RUN rm -fr * .??*
COPY --from=build /site/public /usr/share/nginx/html

EXPOSE 80
