"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const property_tuning_dto_1 = require("./api/dtos/property-tuning.dto");
const app_module_1 = require("./app.module");
require('dotenv').config();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalInterceptors();
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
        }));
        // CORS configuration
        app.enableCors({
            origin: ['http://localhost:3000', 'http://localhost:4000', 'http://example3.com'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization', 'X-API-KEY'],
            exposedHeaders: ['Authorization', 'X-API-KEY'],
            credentials: true,
        });
        //Swagger configuration
        const config = new swagger_1.DocumentBuilder()
            .setTitle(process.env.PROJECT_TITLE)
            .setDescription(process.env.PROJECT_DESCRIPTION)
            .setVersion(process.env.VERSION)
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config, {
            extraModels: [property_tuning_dto_1.PropertyTuningDto],
        });
        swagger_1.SwaggerModule.setup('api', app, document);
        yield app.listen(process.env.PORT || 3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map