// common.decorators.ts

import { createParamDecorator } from '@nestjs/common';
import { SortBy } from '../enum/enum-sort-by';

export const DataSearchQueryDecorator = createParamDecorator((data, req) => {
  const query = req && req.query ? req.query : {};
  return {
    page: parseInt(query.page, 10) || 1,
    limit: parseInt(query.limit, 10) || 10,
    order: query.order || 'createdAt',
    sort: query.sort === 'asc' ? SortBy.ASC : SortBy.DESC,
    search: query.search || '',
  };
});
