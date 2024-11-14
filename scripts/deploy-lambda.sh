#!/bin/bash

# Check if function name is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide the function name"
    echo "Usage: ./deploy-lambda.sh <function-name>"
    exit 1
fi

FUNCTION_NAME=$1

# Deploy to AWS Lambda
echo "Deploying to AWS Lambda..."
aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://dist/$FUNCTION_NAME.zip"

if [ $? -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed"
    exit 1
fi