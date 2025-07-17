import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Order } from '@lib/enums/order.enum';
import { PaginationMetaParameters } from '../interfaces/pagination.interface';

class PaginationMeta {
  @ApiProperty({
    description: 'Current page number.',
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    description: 'Number of items per page.',
    example: 25,
  })
  readonly take: number;

  @ApiProperty({
    description: 'Total number of items available.',
    example: 200,
  })
  readonly itemCount: number;

  @ApiProperty({
    description: 'Total number of pages calculated from itemCount and take.',
    example: 8,
  })
  readonly pageCount: number;

  @ApiProperty({
    description: 'Indicates if there is a previous page.',
    example: true,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a next page.',
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor({ pageOptions, itemCount }: PaginationMetaParameters) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

class PaginationDto<T> {
  @ApiProperty({
    description: 'List of items for the current page.',
    isArray: true,
    example: [],
  })
  @IsArray()
  readonly data: T[];
  @ApiProperty({
    description: 'Pagination metadata for the response.',
    type: () => PaginationMeta,
  })
  readonly meta: PaginationMeta;

  constructor(payload: T[], meta: PaginationMeta) {
    this.data = payload;
    this.meta = meta;
  }
}

class PaginationOptions {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly search: string = '';

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 25,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take: number = 25;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

export { PaginationOptions, PaginationDto, PaginationMeta };
