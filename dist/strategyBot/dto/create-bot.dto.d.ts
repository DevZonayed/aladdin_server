export declare class CreateBotDto {
    readonly BotName: string;
    readonly description: string;
    readonly strategySlug: string;
    readonly strategyId: string;
    readonly p2ot: string;
    readonly csrfToken: string;
    readonly isPublic: boolean;
    readonly runningOrders: number;
}
