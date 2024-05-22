import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBinanceBotDto } from '../dto/create-binance-bot.dto';
import { UpdateBinanceBotDto } from '../dto/update-binance-bot.dto';
import { BinanceBot } from '../entities/binance-bot.entity';

@Injectable()
export class BinanceBotService {
    constructor(
        @InjectModel(BinanceBot.name) private binanceBotModel: Model<BinanceBot>,
    ) { }

    async create(createBinanceBotDto: CreateBinanceBotDto): Promise<BinanceBot> {
        const createdBinanceBot = new this.binanceBotModel(createBinanceBotDto);
        return createdBinanceBot.save();
    }

    async findAll(): Promise<BinanceBot[]> {
        return this.binanceBotModel.find().exec();
    }

    async findOne(id: string): Promise<BinanceBot> {
        return this.binanceBotModel.findById(id).exec();
    }

    async update(
        id: string,
        updateBinanceBotDto: UpdateBinanceBotDto,
    ): Promise<BinanceBot> {
        return this.binanceBotModel
            .findByIdAndUpdate(id, updateBinanceBotDto, { new: true })
            .exec();
    }

    async remove(id: string): Promise<any> {
        return this.binanceBotModel.findByIdAndDelete(id).exec();
    }
}
