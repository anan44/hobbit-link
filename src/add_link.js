'use strict';
const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.add_link = (event, context, callback) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  };
  const body = JSON.parse(event.body)
  const deleteTime = Math.floor(new Date(body.deleteDate).getTime() / 1000)
  const params = {
    TableName: "LinkTable",
    Item: {
      alias: body.alias,
      real: body.real,
      timeToLive: deleteTime
    }
  }
  const checkParams = {
    TableName: "LinkTable",
    Key: {
      alias: body.alias
    }
  }

  dynamoDb.get(checkParams, (error, data) => {
    console.log(data)
    if (data && data.Item) {
      console.log("Alias conflict!")
      const res = {
        statusCode: 403,
        headers: headers,
        body: JSON.stringify({
          status: false,
          error: "Alias conflict. Requested alias is currently taken. Try another alias."
        })
      }
      callback(null, res);
      return
    }
    dynamoDb.put(params, (error, data) => {
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
  })
};