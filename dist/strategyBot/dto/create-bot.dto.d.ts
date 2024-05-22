export declare class CreateBotDto {
    readonly BotName: string;
    readonly description: string;
    readonly strategySlugs: string[];
    readonly strategyId: string;
    readonly p20t: string;
    readonly csrfToken: string;
    readonly scrapInterval: number;
    readonly isPublic: boolean;
    readonly runningOrders: number;
}
