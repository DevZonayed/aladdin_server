import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enum';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { CreateBinanceBotDto } from '../dto/create-binance-bot.dto';
import { UpdateBinanceBotDto } from '../dto/update-binance-bot.dto';
import { BinanceBot } from '../entities/binance-bot.entity';
import { BinanceBotService } from '../service/binance-bot.service';

@Controller('binance-bot')
@ApiTags('BinanceBot')
@ApiBearerAuth()
export class BinanceBotController {
    constructor(private readonly binanceBotService: BinanceBotService) { }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SYSTEM_ADMINISTRATOR)
    async create(@Body() createBinanceBotDto: CreateBinanceBotDto): Promise<BinanceBot> {
        return this.binanceBotService.create(createBinanceBotDto);
    }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SYSTEM_ADMINISTRATOR)
    async findAll(): Promise<BinanceBot[]> {
        return this.binanceBotService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SYSTEM_ADMINISTRATOR)
    async findOne(@Param('id') id: string): Promise<BinanceBot> {
        return this.binanceBotService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SYSTEM_ADMINISTRATOR)
    async update(
        @Param('id') id: string,
        @Body() updateBinanceBotDto: UpdateBinanceBotDto,
    ): Promise<BinanceBot> {
        return this.binanceBotService.update(id, updateBinanceBotDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.SYSTEM_ADMINISTRATOR)
    async remove(@Param('id') id: string): Promise<any> {
        return this.binanceBotService.remove(id);
    }
}
