import {
  dynamodbCreateTable,
  dynamodbDescribeTable,
  dynamodbDeleteTable,
  dynamodbCreateRecord,
} from './aws/tables';

const createTableParams = (tableName: string, attrName: string) => ({
  TableName: tableName,
  KeySchema: [{ AttributeName: attrName, KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: attrName, AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
});

const init = async () => {
  try {
    // 1 - create table
    const createTableResult = await dynamodbCreateTable(
      createTableParams('Users', 'userId')
    );
    if (!createTableResult.success) {
      console.error(
        'Failed to create table:',
        createTableResult.error
      );
      return;
    }

    // 2 - describe table
    // const describeTableResult = await dynamodbDescribeTable(
    //   TABLE_NAME
    // );
    // if (!describeTableResult.success) {
    //   console.error(
    //     'Failed to describe table:',
    //     describeTableResult.error
    //   );
    //   return;
    // }

    // 3 - delete table
    // const deleteTableResult = await dynamodbDeleteTable(TABLE_NAME);
    // if (!deleteTableResult.success) {
    //   console.error(
    //     'Failed to delete table:',
    //     deleteTableResult.error
    //   );
    //   return;
    // }

    // 4 - Insert a record (uncomment when needed)
    // const DUMMY_DATA = vendors[0];
    // const createRecordResult = await dynamodbCreateRecord(TABLE_NAME, DUMMY_DATA);
    // if (!createRecordResult.success) {
    //   console.error('Failed to create record:', createRecordResult.error);
    //   return;
    // }

    // 5 - Seed all data (uncomment when needed)
    // for (const vendorData of vendors) {
    //   const createRecordResult = await dynamodbCreateRecord(TABLE_NAME, vendorData);
    //   if (!createRecordResult.success) {
    //     console.error('Failed to create record:', createRecordResult.error);
    //   }
    // }

    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Error in initialization:', error);
  }
};

init();
