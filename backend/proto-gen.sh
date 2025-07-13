#!/bin/bash

yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto;

# Generate TypeScript and gRPC-Web files for frontend
mkdir -p ../frontend/src/proto
protoc -I=proto ./proto/*.proto \
    --js_out=import_style=commonjs:../frontend/src/proto \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:../frontend/src/proto 