import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { app } from './index';
export const handler: APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const serverlessExpress = require('@vendia/serverless-express');
  const handler = serverlessExpress({ app });
  return handler(event, context);
};
