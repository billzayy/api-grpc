```bash
cd ../proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../nodejs/ --grpc_out=grpc_js:../nodejs/ api-grpc.proto
```