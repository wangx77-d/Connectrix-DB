import express from 'express';
import {
  dynamodbCreateRecord,
  dynamodbGetRecord,
  dynamodbUpdateRecord,
  dynamodbDeleteRecord,
} from '../aws/tables';

import {
  PutItemResult,
  GetItemResult,
  DeleteItemResult,
} from '../aws/types';

const router = express.Router();

// Create record endpoint
router.post(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const result: PutItemResult = await dynamodbCreateRecord(
        req.body.tableName,
        req.body.data
      );
      const statusCode = result.success ? 201 : 500;
      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create record' });
    }
  }
);

// Get record endpoint
router.post(
  '/retrieveRecord',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await dynamodbGetRecord(
        req.body.tableName,
        req.body.key
      );
      const statusCode = result.success ? 200 : 500;
      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get record' });
    }
  }
);

// Update record endpoint
router.put(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await dynamodbUpdateRecord(
        req.body.tableName,
        req.body.key,
        req.body.data
      );
      const statusCode = result.success ? 200 : 500;
      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update record' });
    }
  }
);

// Delete record endpoint
router.delete(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await dynamodbDeleteRecord(
        req.body.tableName,
        req.body.key
      );
      const statusCode = result.success ? 200 : 500;
      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }
);

export default router;
