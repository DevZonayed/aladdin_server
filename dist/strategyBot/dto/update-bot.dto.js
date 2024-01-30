"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bot_dto_1 = require("./create-bot.dto");
class UpdateBotDto extends (0, swagger_1.PartialType)(create_bot_dto_1.CreateBotDto) {
}
exports.UpdateBotDto = UpdateBotDto;
//# sourceMappingURL=update-bot.dto.js.map