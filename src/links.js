'use strict';
const uuid = require("uuid");
const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();


module.exports.put_link = (event, context, callback) => {
  const params = {
    TableName: "Link-Table",
    Item: {
      alias: uuid.v1(),
      real: "http://" + uuid.v1()
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