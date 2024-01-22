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
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../common/decorators';
import { DataSearchDecorator } from '../../common/decorators/data-search.decorator';
import { UserRole } from '../../common/enum';
import { SortBy } from '../../common/enum/enum-sort-by';
import { AuthGuard, RolesGuard } from '../../common/guard';
import { CreateStrategyDto } from '../dto/create-strategy.dto';
import { UpdateStrategyDto } from '../dto/update-strategy.dto';
import { StrategyService } from '../service/strategy.service';

@Controller('strategy')
@ApiTags('Strategy')
@ApiBearerAuth()
export class StrategyController {
  constructor(private readonly StrategyService: StrategyService) { }



  @Post(":endpoint")
  async handleWebhook(@Param('endpoint') endpoint: string,) {
    return this.StrategyService.handleWebHook(endpoint);
  }



  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.ADMINISTRATOR,
  )
  async create(
    @Body() createStrategyDto: CreateStrategyDto,
    @Req() requestData: Request
  ): Promise<any> {
    let user: any = requestData["user"]
    let payload = {
      ...createStrategyDto,
      createdBy: user?.sub
    }
    return this.StrategyService.create(
      payload
    );
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
    return this.StrategyService.findAll(
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
    return this.StrategyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('StrategyImage'))
  async update(
    @Param('id') id: string,
    @Body() updateStrategyDto: UpdateStrategyDto,
  ): Promise<any> {
    return this.StrategyService.update(
      id,
      updateStrategyDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return this.StrategyService.remove(id);
  }
}
