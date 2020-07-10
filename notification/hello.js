const AWS = require('aws-sdk');

const ses = new AWS.SES({ region: 'ap-southeast-1' });

module.exports.sendEmail =  async function (event, context) {
  const record = event.Records[0];
  console.log('record processing', record);

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;
  
  const params = {
    Source: 'hoangluong@kms-technology.com',
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

