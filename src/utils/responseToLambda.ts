export const responseToLambda = async (message: string) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    };

    return {
        statusCode: 200,
        body: message, // Lambda response body must be a string
        headers,
    };
}