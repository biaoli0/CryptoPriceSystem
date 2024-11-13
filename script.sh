aws lambda create-function \
    --function-name fetchCryptoCurrentPrice \
    --runtime nodejs20.x \
    --zip-file fileb://crypto-current-price-system.zip \
    --handler fetchCryptoCurrentPrice.handler \
    --role arn:aws:iam::620833996780:role/lambda-execution-role \
    --profile CryptoPriceSystem-620833996780

aws lambda update-function-code \
    --function-name fetchCryptoCurrentPrice \
    --zip-file fileb://crypto-current-price-system.zip \
    --profile CryptoPriceSystem-620833996780
