#!/bin/bash

# Check if function name is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide the function name"
    echo "Usage: ./deploy-lambda.sh <function-name>"
    exit 1
fi

FUNCTION_NAME=$1
SOURCE_FILE="src/lambda/${FUNCTION_NAME}/index.ts"

# Check if the source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file $SOURCE_FILE does not exist"
    echo "Please create the function file first"
    exit 1
fi

# Build the TypeScript file
echo "Building TypeScript file..."
esbuild "${SOURCE_FILE}" \
    --bundle \
    --platform=node \
    --target=node20 \
    --ignore-annotations \
    --minify \
    --analyze \
    --external:aws-sdk \
    --external:@aws-sdk/* \
    --outfile="dist/index.js"

if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi

# Package the function
echo "Packaging function..."
cd dist
zip "${FUNCTION_NAME}.zip" "index.js"
if [ $? -ne 0 ]; then
    echo "Packaging failed"
    exit 1
fi
cd ..