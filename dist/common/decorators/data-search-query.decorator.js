"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSearchQueryDecorator = void 0;
const common_1 = require("@nestjs/common");
const enum_sort_by_1 = require("../enum/enum-sort-by");
exports.DataSearchQueryDecorator = (0, common_1.createParamDecorator)((data, req) => {
    const query = req && req.query ? req.query : {};
    return {
        page: parseInt(query.page, 10) || 1,
        limit: parseInt(query.limit, 10) || 10,
        order: query.order || 'createdAt',
        sort: query.sort === 'asc' ? enum_sort_by_1.SortBy.ASC : enum_sort_by_1.SortBy.DESC,
        search: query.search || '',
    };
});
//# sourceMappingURL=data-search-query.decorator.js.map