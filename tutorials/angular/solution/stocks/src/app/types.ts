export interface Stock {
    Ask: number;
    Bid: number;
    BPOD: string;
    Bloomberg: string;
    Description: string;
    Exchange: string;
    RIC: string;
    Venues: string;
}

export interface StockPriceUpdate {
    RIC: string;
    Bid: number;
    Ask: number;
}

export interface FullPriceUpdate {
    stocks: StockPriceUpdate[];
}