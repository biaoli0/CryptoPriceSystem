#!/bin/bash

# Default values
DEFAULT_RUNTIME="nodejs20.x"
DEFAULT_HANDLER="index.handler"
DEFAULT_ROLE="arn:aws:iam::620833996780:role/lambda-execution-role"

# Check if function name is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide the function name"
    echo "Usage: ./create-lambda.sh <function-name> [runtime] [handler] [role-arn]"
    echo "Default runtime: $DEFAULT_RUNTIME"
    echo "Default handler: $DEFAULT_HANDLER"
    echo "Default role: $DEFAULT_ROLE"
    exit 1
fi

# Assign parameters
FUNCTION_NAME=$1
RUNTIME=${2:-$DEFAULT_RUNTIME}
HANDLER=${3:-$DEFAULT_HANDLER}
ROLE=${4:-$DEFAULT_ROLE}

# Check if the function already exists
if aws lambda get-function --function-name "$FUNCTION_NAME" 2>/dev/null; then
    echo "Error: Function $FUNCTION_NAME already exists"
    exit 1
fi

# Create the Lambda function
echo "Creating Lambda function: $FUNCTION_NAME"
aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime "$RUNTIME" \
    --role "$ROLE" \
    --handler "$HANDLER" \

if [ $? -eq 0 ]; then
    echo "Lambda function created successfully!"
    echo "Function Name: $FUNCTION_NAME"
    echo "Runtime: $RUNTIME"
    echo "Handler: $HANDLER"
    echo "Role: $ROLE"
else
    echo "Failed to create Lambda function"
    exit 1
fi