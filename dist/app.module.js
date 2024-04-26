"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const exchange_api_module_1 = require("./api/exchange-api.module");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./auth/auth.module");
const rcb_service_1 = require("./tasks/rcb.service");
const user_module_1 = require("./user/user.module");
const web_auth_module_1 = require("./web_auth/web_auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            nestjs_1.MikroOrmModule.forRoot(),
            exchange_api_module_1.ExchangeApi,
            auth_module_1.AuthModule,
            web_auth_module_1.WebAuthModule,
            user_module_1.UserModule,
            axios_1.HttpModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [rcb_service_1.RCBService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map