import AWS, { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { initializeDynamoDB } from '../config/aws';
import {
  CreateTableResult,
  DescribeTableResult,
  DeleteTableResult,
} from './types';

// Initialize DynamoDB client with credentials
// const dynamodb = initializeDynamoDB();
dotenv.config();

AWS.config.update({ region: process.env.AWS_REGION });

const dynamodb = new DynamoDB();

// Generic error handler
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// 1 - Create a table
export const dynamodbCreateTable = async (
  params: DynamoDB.CreateTableInput
): Promise<CreateTableResult> => {
  try {
    const res = await dynamodb.createTable(params).promise();
    console.log('Table created', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error) as string,
        name: 'dynamodbCreateTable error',
      },
    };
  }
};

// 2 - Describe a table
export const dynamodbDescribeTable = async (
  tableName: string
): Promise<DescribeTableResult> => {
  try {
    const res = await dynamodb
      .describeTable({ TableName: tableName })
      .promise();
    console.log('Table retrieved', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error) as string,
        name: 'dynamodbDescribeTable error',
      },
    };
  }
};

// 3 - Delete a table
export const dynamodbDeleteTable = async (
  tableName: string
): Promise<DeleteTableResult> => {
  try {
    const res = await dynamodb
      .deleteTable({ TableName: tableName })
      .promise();
    console.log('Table deleted', res);
    return { success: true, data: res };
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error) as string,
        name: 'dynamodbDeleteTable error',
      },
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
      error: {
        message: handleError(error) as string,
        name: 'dynamodbCreateRecord error',
      },
    };
  }
};

// 5 - Get a record
export const dynamodbGetRecord = async <T>(
  tableName: string,
  key: Record<string, any>
) => {
  try {
    const res = await dynamodb
      .getItem({
        TableName: tableName,
        Key: marshall(key),
      })
      .promise();
    return {
      success: true,
      data: res.Item ? (unmarshall(res.Item) as T) : null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error) as string,
        name: 'dynamodbGetRecord error',
      },
    };
  }
};

// 6 - Update a record
export const dynamodbUpdateRecord = async (
  tableName: string,
  key: Record<string, any>,
  updateAttributes: Record<string, any>
) => {
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updateAttributes).forEach(([key, value], index) => {
    updateExpressionParts.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = value;
  });

  try {
    const res = await dynamodb
      .updateItem({
        TableName: tableName,
        Key: marshall(key),
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(
          expressionAttributeValues
        ),
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return {
      success: true,
      data: res.Attributes ? unmarshall(res.Attributes) : null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error) as string,
        name: 'dynamodbUpdateRecord error',
      },
    };
  }
};

// 7 - Delete a record
export const dynamodbDeleteRecord = async (
  tableName: string,
  key: Record<string, any>
) => {
  try {
    const res = await dynamodb
      .deleteItem({
        TableName: tableName,
        Key: marshall(key),
        ReturnValues: 'ALL_OLD',
      })
      .promise();
    return {
      success: true,
      data: res.Attributes ? unmarshall(res.Attributes) : null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error) as string,
        name: 'dynamodbDeleteRecord error',
      },
    };
  }
};
