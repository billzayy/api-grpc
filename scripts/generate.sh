#!/bin/bash

# Ensure the script is executed from the project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Define paths
PROTO_PATH="$PROJECT_ROOT/api/grpc/proto"
OUT_PATH_GO="$PROJECT_ROOT/api/grpc/go"
OUT_PATH_JS="$PROJECT_ROOT/api/grpc/nodejs"
PROTOC_GEN_GO_PATH=$(which protoc-gen-go)
PROTOC_GEN_GO_GRPC_PATH=$(which protoc-gen-go-grpc)
PROTOC_GEN_JS_PATH=$(which grpc_tools_node_protoc)

# Verify that the required tools are installed
if [[ -z "$PROTOC_GEN_GO_PATH" || -z "$PROTOC_GEN_GO_GRPC_PATH" || -z "$PROTOC_GEN_JS_PATH" ]]; then
  echo "Error: protoc-gen-go, protoc-gen-go-grpc, or grpc-tools not found in PATH."
  exit
fi

# Create output directory if it doesn't exist
mkdir -p "$OUT_PATH_GO"
mkdir -p "$OUT_PATH_JS"

# Generate the Go code from proto files
echo "Generating Go code from proto files..."
protoc --proto_path="$PROTO_PATH" \
  --go_out="$OUT_PATH_GO" \
  --go_opt=paths=source_relative \
  --go-grpc_out="$OUT_PATH_GO" \
  --go-grpc_opt=paths=source_relative \
  "$PROTO_PATH"/*.proto

if [[ $? -ne 0 ]]; then
  echo "Error: protoc command failed."
  exit 1
fi

echo "Go code generation completed successfully."

# Generate the JS code from proto files
echo "Generating JS code from proto files..."
grpc_tools_node_protoc \
  --proto_path="$PROTO_PATH" \
  --js_out=import_style=commonjs,binary:"$OUT_PATH_JS" \
  --grpc_out=grpc_js:"$OUT_PATH_JS" \
  "$PROTO_PATH"/*.proto
  
if [[ $? -ne 0 ]]; then
  echo "Error: protoc command failed."
  exit 1
fi

echo "JS code generation completed successfully."