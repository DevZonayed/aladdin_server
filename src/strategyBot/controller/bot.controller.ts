import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { DataSearchDecorator } from 'src/common/decorators/data-search.decorator';
import { UserRole } from 'src/common/enum';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { CreateBotDto } from '../dto/create-bot.dto';
import { UpdateBotDto } from '../dto/update-bot.dto';
import { UpdateBotTokenDto } from '../dto/update-tokens.dto';
import { BotService } from '../service/bot.service';

@Controller('bot')
@ApiTags('Bot')
@ApiBearerAuth()
export class BotController {
  constructor(private readonly BotService: BotService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.ADMINISTRATOR,
  )
  async create(
    @Body() createStrategyDto: CreateBotDto,
    @Req() requestData: Request
  ): Promise<any> {
    let user: any = requestData["user"]
    let payload = {
      ...createStrategyDto,
      createdBy: user?.sub
    }
    return this.BotService.create(
      payload
    );
  }


  @Post("/start/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.ADMINISTRATOR,
  )
  async start(
    @Req() requestData: Request,
    @Param('id') id: string
  ): Promise<any> {
    return this.BotService.handleStartBot(id);
  }

  @Post("/stop/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.ADMINISTRATOR,
  )
  async stop(
    @Req() requestData: Request,
    @Param('id') id: string
  ): Promise<any> {
    return this.BotService.handleStopBot(id);
  }

  @Post("/status/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.ADMINISTRATOR,
  )
  async getBotStatus(
    @Req() requestData: Request,
    @Param('id') id: string
  ): Promise<any> {
    return this.BotService.getBotStatus(id);
  }



  @Get()
  @DataSearchDecorator([
    { name: 'startDate', type: Date, required: false, example: '2022-01-01' },
    { name: 'endDate', type: Date, required: false, example: '2022-02-01' },
  ])
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('sort') sort: SortBy,
    @Query('search') search: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.BotService.findAll(
      page,
      limit,
      order,
      sort,
      search,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.BotService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateStrategyDto: UpdateBotDto,
  ): Promise<any> {
    return this.BotService.update(
      id,
      updateStrategyDto,
    );
  }

  @Patch('update-token:id')
  @UseGuards(AuthGuard, RolesGuard)
  async updateToken(
    @Param('id') id: string,
    @Body() updateStrategyDto: UpdateBotTokenDto,
  ): Promise<any> {
    return this.BotService.updateBotToken(
      id,
      updateStrategyDto,
    );
  }



  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return this.BotService.remove(id);
  }
}
