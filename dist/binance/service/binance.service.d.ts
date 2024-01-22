export declare class BinanceService {
    BaseUrl: string;
    constructor();
    checkBalance(apiKey: string, secretKey: string): Promise<import("axios").AxiosResponse<any, any>>;
    private signatureGenerator;
}
