# Use the official Golang image as the base image
FROM golang:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum from the main directory to the Docker image
COPY ../go.mod ../go.sum ./

# Download dependencies
RUN go mod download

COPY .. .

COPY ../.env .env

# Copy the source code from the "cmd" folder to the Docker image
COPY ../cmd/main.go .

# Compile the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Use a smaller base image for the final stage
FROM alpine:latest

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/main /app

COPY --from=builder /app/.env /app/

# Specify the entry point for the Docker container
ENTRYPOINT ["/app/main"]
