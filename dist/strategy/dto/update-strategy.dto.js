"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStrategyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_strategy_dto_1 = require("./create-strategy.dto");
class UpdateStrategyDto extends (0, swagger_1.PartialType)(create_strategy_dto_1.CreateStrategyDto) {
}
exports.UpdateStrategyDto = UpdateStrategyDto;
//# sourceMappingURL=update-strategy.dto.js.map