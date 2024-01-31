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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';
import { DataSearchDecorator } from 'src/common/decorators/data-search.decorator';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enum';
import { RolesGuard } from '../../common/guard';
import { AuthGuard } from '../../common/guard/auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { SubUnsubStrategyDto } from '../dto/sub-unsub-strategy.dto';
import { UpdateUserCredentialsDto } from '../dto/update-user-credentials.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('binance-credentials')
  @Roles(UserRole.USER, UserRole.SYSTEM_ADMINISTRATOR, UserRole.PRO_USER, UserRole.ADMINISTRATOR)
  updateBinanceCredentials(@Req() request: Request, @Body() updateBinanceCredentials: UpdateUserCredentialsDto) {
    let user: any = request["user"]
    return this.userService.updateBinanceCredentials(user.sub, updateBinanceCredentials);
  }

  @Post('subscribe-to-strategy')
  @Roles(UserRole.USER, UserRole.SYSTEM_ADMINISTRATOR, UserRole.PRO_USER, UserRole.ADMINISTRATOR)
  subscribeToAStrategy(@Req() request: Request, @Body() subUnsubStrategyDto: SubUnsubStrategyDto) {
    let user: any = request["user"]
    let strategyId: Types.ObjectId = subUnsubStrategyDto.strategyId
    return this.userService.subscribeToStrategy(user.sub, strategyId);
  }

  @Post('unsubscribe-to-strategy')
  @Roles(UserRole.USER, UserRole.SYSTEM_ADMINISTRATOR, UserRole.PRO_USER, UserRole.ADMINISTRATOR)
  unSubscribeToAStrategy(@Req() request: Request, @Body() subUnsubStrategyDto: SubUnsubStrategyDto) {
    let user: any = request["user"]
    let strategyId: Types.ObjectId = subUnsubStrategyDto.strategyId
    return this.userService.unSubscribeToStrategy(user.sub, strategyId);
  }

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
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
    return this.userService.findAll(
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
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
