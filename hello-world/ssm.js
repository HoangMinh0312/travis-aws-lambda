const AWS = require('aws-sdk')

exports.getFromSSM = async name => {
  const ssm = new AWS.SSM()

  console.log(ssm);
  const params = {
    Name: name,
    WithDecryption: true
  }

  const result = await ssm.getParameter(params).promise()
  return result.Parameter.Value
}
