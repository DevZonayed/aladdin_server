"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const axios_1 = require("@nestjs/axios");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const terminus_1 = require("@nestjs/terminus");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const binance_module_1 = require("./binance/binance.module");
const core_module_1 = require("./common/config/core/core.module");
const mail_connection_1 = require("./common/constants/mail.connection");
const mongoose_connection_1 = require("./common/constants/mongoose.connection");
const throttle_config_1 = require("./common/constants/throttle.config");
const http_config_1 = require("./common/module/http/http-config");
const strategy_module_1 = require("./strategy/strategy.module");
const user_module_1 = require("./user/user.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            terminus_1.TerminusModule,
            axios_1.HttpModule.register(http_config_1.httpConfig),
            mongoose_1.MongooseModule.forRoot((0, mongoose_connection_1.getDefaultDbConnectionString)()),
            mailer_1.MailerModule.forRoot((0, mail_connection_1.getDefaultMailConnectionConfig)()),
            throttler_1.ThrottlerModule.forRoot((0, throttle_config_1.getThroTTLconfig)()),
            cache_manager_1.CacheModule.register({ isGlobal: true, ttl: 43200000 }),
            core_module_1.CoreConfigModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            jwt_1.JwtModule,
            binance_module_1.BinanceModule,
            strategy_module_1.StrategyModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map