import AWS, { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { initializeDynamoDB } from '../config/aws';
import {
    CreateTableResult,
    DescribeTableResult,
    DeleteTableResult,
} from './types';

dotenv.config();
let dynamodb: DynamoDB;

if (process.env.ENV === 'local') {
    dynamodb = initializeDynamoDB();
} else {
    AWS.config.update({ region: process.env.AWS_REGION });
    dynamodb = new DynamoDB();
}

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
export const dynamodbCreateRecord = async <T extends Record<string, any>>(
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
                ExpressionAttributeValues: marshall(expressionAttributeValues),
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

// 8 - Query Records with conditions
export const dynamodbQueryRecords = async (
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    indexName?: string,
    filterExpression?: string,
    expressionAttributeNames?: Record<string, string>
) => {
    try {
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
        };

        if (indexName) {
            params.IndexName = indexName;
        }

        if (filterExpression) {
            params.FilterExpression = filterExpression;
        }

        if (expressionAttributeNames) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        const res = await dynamodb.query(params).promise();
        return {
            success: true,
            data: res.Items ? res.Items.map((item) => unmarshall(item)) : [],
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: handleError(error) as string,
                name: 'dynamodbQueryRecords error',
            },
        };
    }
};

// 9 - Scan all records
export const dynamodbScanAllRecords = async (tableName: string) => {
    try {
        const res = await dynamodb.scan({ TableName: tableName }).promise();
        return {
            success: true,
            data: res.Items ? res.Items.map((item) => unmarshall(item)) : [],
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: handleError(error) as string,
                name: 'dynamodbScanAllRecords error',
            },
        };
    }
};

// 10 - Delete all records
export const dynamodbDeleteAllRecords = async (tableName: string) => {
    try {
        const res = await dynamodb
            .deleteTable({ TableName: tableName })
            .promise();
        return { success: true, data: res };
    } catch (error) {
        return {
            success: false,
            error: {
                message: handleError(error) as string,
                name: 'dynamodbDeleteAllRecords error',
            },
        };
    }
};
