export type SearchRecord = {
    price: number,
    timestamp: number,
    userEmail: string,
    currency: string,
    coinId: string,
    coinData: {
        name: string,
    }
}