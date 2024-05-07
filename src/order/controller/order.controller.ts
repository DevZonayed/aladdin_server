import {
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { DataSearchDecorator } from 'src/common/decorators/data-search.decorator';
import { UserRole } from 'src/common/enum';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { StatusEnum } from '../enums/status.enum';
import { OrderService } from '../service/order.service';

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get('all-open-orders/:strategyId')
    @DataSearchDecorator([
        { name: 'startDate', type: Date, required: false, example: '2022-01-01' },
        { name: 'endDate', type: Date, required: false, example: '2022-02-01' },
    ])
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(
        UserRole.SYSTEM_ADMINISTRATOR,
        UserRole.ADMINISTRATOR,
    )
    async findAllOpenOrderByStrategy(
        @Param('strategyId') strategyId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('order') order: string,
        @Query('sort') sort: SortBy,
        @Query('search') search: string,
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date,
    ) {
        return this.orderService.findAllOpenOrderByStrategy(
            strategyId,
            page,
            limit,
            order,
            sort,
            search,
            startDate,
            endDate,
        );
    }


    @Post('close-order/:orderId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(
        UserRole.SYSTEM_ADMINISTRATOR,
        UserRole.ADMINISTRATOR,
    )
    async closeOrder(
        @Param('orderId') orderId: string,
    ) {
        return this.orderService.update(
            orderId,
            { status: StatusEnum.CLOSED },
        );

    }



}
