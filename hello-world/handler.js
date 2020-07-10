'use strict';
var moment = require('moment');

const { v4: uuidv4 } = require('uuid');
const middy = require('@middy/core')

const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const httpEventNormalizer = require('@middy/http-event-normalizer');
const createError = require('http-errors');
var AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const commonHoc = require('./lib/commonMiddleWare');

const validator = require('@middy/validator') ;
const createAuctionSchema = require('./lib/schema/createAuctionSchema');
const logging = require('detergent-database-db-layer');

const uploadPictureToS3 = require('./lib/uploadPictureToS3');

const dao = require('./lib/dynamodb-lib');

exports.createAuction = commonHoc.middyHOC(async (event, context) => {
  const sqs = new AWS.SQS();
  logging.log();
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;

  const now = new Date();

  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuidv4(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };  

  await sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE,
    MessageBody: JSON.stringify({
      subject: 'No bids on your auction item :(',
      recipient: 'luongminhhoang01123@gmail.com',
      body: `Oh no! Your item "${title}" didn't get any bids. Better luck next time!`,
    }),
  }).promise();

  await dao.put({
    TableName: process.env.HOANG_TABLE,
    Item: auction,
  });

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}).use(validator({ inputSchema: createAuctionSchema }));

module.exports.getAuctions = commonHoc.middyHOC(async (event,context) => {

  let auctions;
  const params = {
    TableName: process.env.HOANG_TABLE
  };

  try {
    const result = await dao.scan(params);
    auctions = result.Items;
    console.log(auctions);
  } catch (error) {
    console.log(error);
    throw new Error();
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auctions),
  };
});

module.exports.getAuction = commonHoc.middyHOC( async (event,context)=>{
  let auction;
  const {id} = event.pathParameters;

  try {

    const result = await dao.get({
      TableName: process.env.HOANG_TABLE,
      Key: {id}
    });

    auction = result.Item;
  } catch (error) {
    console.log(error);
    throw new Error();
  }

  if(!auction){
    throw new createError.NotFound("Aunction not found");
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
});

module.exports.placeBird = commonHoc.middyHOC( async (event , context)=>{
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const params = {
      TableName: process.env.HOANG_TABLE,
      Key: {id},
      UpdateExpression: 'set highestBid.amount= :amount',
      ExpressionAttributeValues:{
        ':amount':amount
      },
      ReturnValues: 'ALL_NEW'
    };
    
    let updatedAuction;

    try {
      const result = await dao.update(params);
      updatedAuction = result.Attributes;
    } catch (error) {
      // throw new Error("chim be");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
});


module.exports.uploadAuctionPicture = async function(event , context) {
  const { id } = event.pathParameters;
  const result  = await dao.get({
    TableName: process.env.HOANG_TABLE,
    Key: { id },
  });
  const auction = result.Item;
  console.log(auction);

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  const pictureUrl = await uploadPictureToS3.uploadPictureToS3(auction.id + '.jpg', buffer);
  const updatedAuction = await uploadPictureToS3.setAuctionPictureUrl(auction.id, pictureUrl);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };

}

module.exports.processStream = (event, context, callback) => {
  console.log(event.Records);
  console.log(event.Records[0].dynamodb.NewImage);
	console.log(`Received ${event.Records.length} events`);
  callback();
}

module.exports.testErrorMessage = () =>{
  throw new Error("some message");
}

module.exports.testErrorMessageAsync = async () =>{
  throw new Error("some message 2");
}