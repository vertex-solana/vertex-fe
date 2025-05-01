export interface ObjectMultiLanguageProps {
  [x: string]: string;
}

export interface KeyAbleProps {
  [key: string]: any;
}

export enum BlockchainTransactionStatusEnum {
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface BaseResponseData<T> {
  statusCode: number;
  message?: string;
  error?: string;
  data: T;
}

export interface ResponseDataList<T> {
  statusCode: number;
  data: {
    pageData: T;
    pageNum: number;
    total: number;
  };
}

export interface DataListInterface<T> {
  pageData: T;
  pageNum: number;
  total: number;
}

export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}
