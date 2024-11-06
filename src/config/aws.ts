import { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';
import { AWSRegions } from '../aws/variables';

dotenv.config();

interface AWSConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string; // For local DynamoDB testing
}

// Load environment variables
const getAWSConfig = (): AWSConfig => {
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    console.log(process.env);
    throw new Error(
      'Required AWS credentials are missing. Please check your environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY'
    );
  }

  return {
    region: process.env.AWS_REGION || AWSRegions.US_EAST_1,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.DYNAMODB_ENDPOINT,
  };
};

// Initialize DynamoDB client with credentials
export const initializeDynamoDB = (): DynamoDB => {
  const config = getAWSConfig();
  return new DynamoDB(config);
};
