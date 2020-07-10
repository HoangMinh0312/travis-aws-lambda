const handler = require("./libs/handler-lib");
const dynamoDb = require("./libs/dynamodb-lib");
const { v4: uuidv4 } = require('uuid');

export const main = handler(async (event, context) => {
    const params = {
      TableName: process.env.TABLE_NOTE,
      // 'Key' defines the partition key and sort key of the item to be retrieved
      // - 'userId': Identity Pool identity id of the authenticated user
      // - 'noteId': path parameter
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: event.pathParameters.id
      }
    };
  
    const result = await dynamoDb.get(params);
    if ( ! result.Item) {
      throw new Error("Item not found.");
    }
  
    // Return the retrieved item
    return result.Item;
  });