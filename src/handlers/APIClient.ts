import axios from 'axios';

type RequestConfig = {
    headers?: Record<string, string>;
}

type APIConfig = {
    baseURL: string;
} & RequestConfig;

export class APIClient {
    private config: RequestConfig;
    private baseURL: string;

    constructor(config: APIConfig) {
        this.baseURL = config.baseURL;
        this.config = {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                ...config.headers,
            },
        };
    }

    async responseToLambda(message: string) {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };

        return {
            statusCode: 200,
            body: message, // Lambda response body must be a string
            headers,
        };
    }

    async get(endpoint: string) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            console.info('url', url.toString());
            const response = await axios.get(url.toString(), {
                ...this.config
            });

            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch: ${error.message}`);
            }
            throw error;
        }
    }

} 