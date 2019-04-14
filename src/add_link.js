'use strict';
const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.add_link = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const params = {
    TableName: "LinkTable",
    Item: {
      alias: body.alias,
      real: body.real
    }
  }

  dynamoDb.put(params, (error, data) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    if (error) {
      console.log(error)
      const res = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          status: false
        })
      };
      callback(null, res);
      return;
    }

    const res = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    }
    callback(null, res);
  })
};