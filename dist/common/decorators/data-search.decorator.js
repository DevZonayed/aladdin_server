"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSearchDecorator = void 0;
const swagger_1 = require("@nestjs/swagger");
const enum_sort_by_1 = require("../enum/enum-sort-by");
const DataSearchDecorator = (additionalFilters = []) => {
    return function (target, propertyKey, descriptor) {
        const baseFilters = [
            { name: 'page', type: Number, required: false, example: 1 },
            { name: 'limit', type: Number, required: false, example: 10 },
            { name: 'order', type: String, required: false, example: 'createdAt' },
            { name: 'sort', enum: enum_sort_by_1.SortBy, required: false, example: 'desc' },
            { name: 'search', type: String, required: false, example: 'keyword' },
        ];
        const allFilters = [...baseFilters, ...additionalFilters];
        allFilters.forEach((filter) => {
            (0, swagger_1.ApiQuery)(filter)(target, propertyKey, descriptor);
        });
    };
};
exports.DataSearchDecorator = DataSearchDecorator;
//# sourceMappingURL=data-search.decorator.js.map