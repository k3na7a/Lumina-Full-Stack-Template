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

import { Order } from '../enums/order.enum';
import { PaginationMetaParameters } from '../interfaces/pagination.interface';

class PaginationMeta {
  @ApiProperty()
  readonly page: number;
  @ApiProperty()
  readonly take: number;
  @ApiProperty()
  readonly itemCount: number;
  @ApiProperty()
  readonly pageCount: number;
  @ApiProperty()
  readonly hasPreviousPage: boolean;
  @ApiProperty()
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
  @ApiProperty({ isArray: true })
  @IsArray()
  readonly data: T[];
  @ApiProperty({ type: () => PaginationMeta })
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
