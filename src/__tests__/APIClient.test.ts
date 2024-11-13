import axios from 'axios';
import { APIClient } from '../handlers/APIClient';

describe('APIClient', () => {
    let mockFetch: jest.Mock;
    let apiClient: APIClient;

    beforeEach(() => {
        // Mock the global fetch function
        mockFetch = jest.fn();
        axios.get = mockFetch;

        // Initialize APIClient with test configuration
        apiClient = new APIClient({
            baseURL: 'https://api.coingecko.com/api/v3/',
            headers: { 'x-cg-demo-api-key': 'test' }
        }
        );
    });

    describe('get', () => {
        it('should handle HTTP errors', async () => {
            const mockResponse = {
                ok: false,
                status: 404,
            };
            mockFetch.mockResolvedValueOnce(mockResponse);

            await expect(apiClient.get('/price')).rejects.toThrow('HTTP error! status: 404');
        });

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(apiClient.get('/price')).rejects.toThrow('Failed to fetch: Network error');
        });
    });
});
