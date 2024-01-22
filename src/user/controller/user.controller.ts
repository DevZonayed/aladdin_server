import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';
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
  @Roles(UserRole.PRO_USER, UserRole.SYSTEM_ADMINISTRATOR)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
