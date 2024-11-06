import { DynamoDB } from 'aws-sdk';

export interface DynamoDBError extends Error {
  code?: string;
  statusCode?: number;
  requestId?: string;
  retryable?: boolean;
  message: string;
}

export interface DynamoDBResult<T> {
  success: boolean;
  data?: T;
  error?: DynamoDBError;
}

// Common result types
export type CreateTableResult =
  DynamoDBResult<DynamoDB.CreateTableOutput>;
export type DescribeTableResult =
  DynamoDBResult<DynamoDB.DescribeTableOutput>;
export type DeleteTableResult =
  DynamoDBResult<DynamoDB.DeleteTableOutput>;
