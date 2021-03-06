'use strict';
const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.get_link = (event, context, callback) => {
  console.log(event)
  const aliasLink = event.pathParameters.link
  const dynamoParams = {
    TableName: "LinkTable",
    Key: {
      alias: aliasLink
    }
  }
  console.log(dynamoParams)

  dynamoDb.get(dynamoParams, (error, data) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };

    if (error) {
      console.log(error)
      const res = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          status: false,
          message: "no link found"
        })
      }
      callback(null, res);
      return;
    }

    if (!data || !data.Item ) {
      console.log("no link found")
      const res = {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({
          status: false,
          message: `Link: ${aliasLink} not found.`
        })
      }
      callback(null, res);
      return;
    }

    headers.location = data.Item.real
    const res = {
      statusCode: 301,
      headers: headers,
      body: JSON.stringify({
        data: data,
        link: data.Item.real
      })
    }
    callback(null, res);
  })
}