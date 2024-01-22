"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileImageUploadModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
let UserProfileImageUploadModule = class UserProfileImageUploadModule {
};
exports.UserProfileImageUploadModule = UserProfileImageUploadModule;
exports.UserProfileImageUploadModule = UserProfileImageUploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/user-profile/',
                    filename: (req, file, cb) => {
                        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                        cb(null, `${(0, uuid_1.v4)()}-${uniqueSuffix}-${file.originalname}`);
                    },
                }),
            }),
        ],
        exports: [platform_express_1.MulterModule],
    })
], UserProfileImageUploadModule);
//# sourceMappingURL=user-profile-image-upload.module.js.map