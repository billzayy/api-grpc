# Variables
ENVIRONMENT_PATH=../.env
DOCKER_GO_IMAGE_NAME=grpc-server
DOCKER_JS_IMAGE_NAME=grpc-node
DOCKERFILE_GO_PATH=./build/go/Dockerfile
DOCKERFILE_JS_PATH=./build/nodejs/Dockerfile
DOCKER_CONTEXT=.
DOCKER_COMPOSE_FILE=../deployments/docker-compose.yml
DOCKER_COMPOSE_CMD=docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(ENVIRONMENT_PATH)

# Default target
all: allow generate build run

install:
	npm install -g grpc-tools
	cd ../ && npm install
	go mod download

allow:
	chmod +x generate.sh ../deployments/proxy/nginx-entrypoint.sh

# Run generate.sh script
generate:
	@echo "Running generate.sh..."
	./generate.sh

# Build the Docker image
build:
	@echo "Building Docker Go image $(DOCKER_GO_IMAGE_NAME)..."
	cd ../ && docker build -f $(DOCKERFILE_GO_PATH) -t $(DOCKER_GO_IMAGE_NAME) $(DOCKER_CONTEXT)

	@echo "Building Docker Node image $(DOCKER_JS_IMAGE_NAME)..."
	cd ../ && docker build -f $(DOCKERFILE_JS_PATH) -t $(DOCKER_JS_IMAGE_NAME) $(DOCKER_CONTEXT)

# Run the Docker container using Docker Compose
run:
	@echo "Starting services with Docker Compose..."
	$(DOCKER_COMPOSE_CMD) up -d

# Stop and remove Docker containers
down:
	@echo "Stopping and removing Docker containers..."
	$(DOCKER_COMPOSE_CMD) down

# Clean up Docker images and build artifacts
clean:
	@echo "Cleaning Docker images and build artifacts..."
	docker rmi $(DOCKER_GO_IMAGE_NAME)
	docker rmi $(DOCKER_JS_IMAGE_NAME)
	docker system prune --volumes -f
	rm -f app/main
