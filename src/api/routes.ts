import express from 'express';
import {
  dynamodbCreateTable,
  dynamodbDescribeTable,
  dynamodbDeleteTable,
} from '../aws/tables';
import {
  CreateTableResult,
  DescribeTableResult,
  DeleteTableResult,
} from '../aws/types';
import { DynamoDB } from 'aws-sdk';

const router = express.Router();

// Create table endpoint
router.post(
  '/tables',
  async (req: express.Request, res: express.Response) => {
    try {
      const { tableName, attributeName } = req.body;
      const params: DynamoDB.CreateTableInput = {
        TableName: tableName,
        KeySchema: [
          { AttributeName: attributeName, KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
          { AttributeName: attributeName, AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
      };

      const result: CreateTableResult = await dynamodbCreateTable(
        params
      );

      const statusCode = result.success ? 201 : 500;

      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create table' });
    }
  }
);

// Describe table endpoint
router.get(
  '/tables/:tableName',
  async (req: express.Request, res: express.Response) => {
    try {
      const result: DescribeTableResult = await dynamodbDescribeTable(
        req.params.tableName
      );
      if (result.success) {
        res.json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to describe table' });
    }
  }
);

export default router;
