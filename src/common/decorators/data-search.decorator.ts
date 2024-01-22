// common.decorators.ts

import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';
import { SortBy } from '../enum/enum-sort-by';

export const DataSearchDecorator = (
  additionalFilters: ApiQueryOptions[] = [],
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const baseFilters: ApiQueryOptions[] = [
      { name: 'page', type: Number, required: false, example: 1 },
      { name: 'limit', type: Number, required: false, example: 10 },
      { name: 'order', type: String, required: false, example: 'createdAt' },
      { name: 'sort', enum: SortBy, required: false, example: 'desc' },
      { name: 'search', type: String, required: false, example: 'keyword' },
    ];

    const allFilters = [...baseFilters, ...additionalFilters];

    allFilters.forEach((filter) => {
      ApiQuery(filter)(target, propertyKey, descriptor);
    });
  };
};
