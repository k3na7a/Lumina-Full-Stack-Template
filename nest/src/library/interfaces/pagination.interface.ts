import { PaginationOptions } from "../dto/pagination.dto";

export interface PaginationMetaParameters {
  readonly pageOptions: PaginationOptions;
  readonly itemCount: number;
}
