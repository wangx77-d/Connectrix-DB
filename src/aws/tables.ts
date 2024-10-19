import { DynamoDB } from 'aws-sdk';
import { AWSRegions } from './variables';
import { marshall } from '@aws-sdk/util-dynamodb';

const dynamodb = new DynamoDB({ region: AWSRegions.US_EAST_1 });

// Generic error handler
const handleError = (operation: string, error: unknown): Error => {
  console.error(`Error in ${operation}:`, error);
  return new Error(`${operation} error`);
};

// 1 - Create a table
export const dynamodbCreateTable = async (
  params: DynamoDB.CreateTableInput
) => {
  try {
    const res = await dynamodb.createTable(params).promise();
    console.log('Table created', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: handleError('dynamodbCreateTable', error),
    };
  }
};

// 2 - Describe a table
export const dynamodbDescribeTable = async (tableName: string) => {
  try {
    const res = await dynamodb
      .describeTable({ TableName: tableName })
      .promise();
    console.log('Table retrieved', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: handleError('dynamodbDescribeTable', error),
    };
  }
};

// 3 - Delete a table
export const dynamodbDeleteTable = async (tableName: string) => {
  try {
    const res = await dynamodb
      .deleteTable({ TableName: tableName })
      .promise();
    console.log('Table deleted', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: handleError('dynamodbDeleteTable', error),
    };
  }
};

// 4 - Insert a record (generalized version)
export const dynamodbCreateRecord = async <
  T extends Record<string, any>
>(
  tableName: string,
  item: T
) => {
  try {
    const res = await dynamodb
      .putItem({
        TableName: tableName,
        Item: marshall(item),
      })
      .promise();
    console.log('Record created', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: handleError('dynamodbCreateRecord', error),
    };
  }
};
