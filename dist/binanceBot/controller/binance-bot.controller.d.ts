import { CreateBinanceBotDto } from '../dto/create-binance-bot.dto';
import { UpdateBinanceBotDto } from '../dto/update-binance-bot.dto';
import { BinanceBot } from '../entities/binance-bot.entity';
import { BinanceBotService } from '../service/binance-bot.service';
export declare class BinanceBotController {
    private readonly binanceBotService;
    constructor(binanceBotService: BinanceBotService);
    create(createBinanceBotDto: CreateBinanceBotDto): Promise<BinanceBot>;
    findAll(): Promise<BinanceBot[]>;
    findOne(id: string): Promise<BinanceBot>;
    update(id: string, updateBinanceBotDto: UpdateBinanceBotDto): Promise<BinanceBot>;
    remove(id: string): Promise<any>;
}
