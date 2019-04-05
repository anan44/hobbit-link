'use strict';
const uuid = require("uuid");
const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();


module.exports.put_link = (event, context, callback) => {
  console.log("starting shit")
  const params = {
    TableName: "Link-Table",
    Item: {
      alias: uuid.v1(),
      real: "http://" + uuid.v1()
    }
  }

  console.log("just before put")
  dynamoDb.put(params, (error, data) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    console.log("before error check: ")
    console.log(error)
    if (error) {
      const res = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false })
      };
    console.log("before error callback")
    callback(null, res);
    console.log("after error callback")
    return;
    }

    console.log("did not fail")
    const res = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    }
    console.log("before final callback")
    callback(null, res);
  })
};
