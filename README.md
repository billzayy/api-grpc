# API-GRPC with GoLang and JS

This project is created for the demo collaboration of gRPC and RESTful API with GoLang and JS.

Features of this demo are about : 
* Add product into cart
* Products in cart will expire in 5 minutes.
* Simulate payment service with gRPC

After run the project, use Postman API to check all the result. Import collection and environment files on [`/api/postman`](/api/postman/) into your Postman application.

**P/S**: In this project also have [`nginx web server`](https://nginx.org/en/) to build api gateway.

## Install & Download 
Before run the application, ensure that you already downloaded all necessary packages and apps:
* [`Go Package`](https://go.dev/doc/install)
* [`Npm Package` ](https://nodejs.org/en/download/package-manager/current)
* [`Docker Desktop`](https://docs.docker.com/desktop/)
* [`Postman` ](https://www.postman.com/downloads/)
* [`Protocol Buffer Compiler`](https://grpc.io/docs/protoc-installation/)

Then, update your `PATH` so that the `protoc` compiler can find the plugins for gRPC GoLang:
```bash
$ export PATH="$PATH:$(go env GOPATH)/bin"
```

You can check if some tools are already downloaded or not with : 
```bash
$ go version # check golang version
$ npm version # check npm version
$ protoc --version # check protocol buffer compiler
```

If you already get all packages above, you still need to install this some tools for this project with : 
```bash
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest # grpc for golang
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest # grpc for golang
$ npm install -g grpc-tools # grpc for nodejs
```

## Setup
All you need is create `.env` file and replace all values inside `< >` of this properties:
```bash
# Servers Configure
GRPC_HOST="grpc-server"
GRPC_PORT="<grpc_port>" # default: 50051
JS_PORT="<nodejs_port>" # default: 3000

# Mongo Configure
MONGO_HOST="mongodb"
MONGO_PORT="<mong_port>" # default: 27017
MONGO_USERNAME="<mongo_username>" # default: root
MONGO_PASSWORD="<mongo_password>" # default: root

# Redis Configure
REDIS_URL="redis://redis:<redis_server_port>" # redis://[host][:port]
REDIS_PASS="<redis_password>" # default: root
REDIS_SERVER_PORT="<redis_server_port>" # default: 6379
REDIS_INSIGHT_PORT="<redis_port>" # default: 8001

# Nginx Configure
NGINX_PORT="<nginx_port>" # default: 80
```
## Run
To run all project, go to `/scripts` folder and run `make` command:
```bash
make all
``` 
If you want to run this project step-by-step, run `make` command with some options:
* `install` : To install all project `npm` and `go` packages .

    ```bash
    make install
    ```
* `allow` : Allow system to run all `.sh` files.
    ```bash
    make allow
    ```
* `generate` : To generate gRPC configure files for `golang` and `nodejs` on folder [`/api/grpc/`](./api/grpc/).
    ```bash
    make generate
    ```
* `build` : To build docker image for `golang` and `nodejs` application with `Dockerfile` on folder [`/build`](./build/).
    ```bash
    make build
    docker images # check created images
    ```
* `run` : To initiate application with `docker-compose` on file [`/deployments/docker-compose.yml`](./deployments/docker-compose.yml).
    ```bash
    make run
    ```
* `down` : To stop and remove all docker containers.
    ```bash
    make down
* `clean` : To clean all cache docker images and volumes.
    ```bash
    make clean
    ```
---
$${\color{lightgreen}HAPPY \space CODING \space 😉 \space !!!}$$	