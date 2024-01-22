import { Exchanges } from "src/common/enum/enum-exchanges";


export interface CredentialsInterface<T extends Exchanges> {
    exchange: T;
    apiKey: string;
    apiSecret: string;
}
