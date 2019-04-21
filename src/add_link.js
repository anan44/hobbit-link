'use strict';
const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

const getConflict = async alias => {
  const params = {
    TableName: "LinkTable",
    Key: {
      alias: alias
    }
  }
  const conflict = dynamoDb.get(params).promise()
  return conflict
}

const postNewLink =  async event => {
  const body = JSON.parse(event.body)
  const deleteTime = Math.floor(new Date(body.deleteDate).getTime() / 1000)
  const params = {
    TableName: "LinkTable",
    Item: {
      alias: body.alias,
      real: body.real,
      secret: body.secret,
      timeToLive: deleteTime
    }
  }
  const newPost = dynamoDb.put(params).promise()
  return newPost
}

module.exports.add_link = async (event, context, callback) => {
  const body = JSON.parse(event.body)

  const conflict = await getConflict(body.alias)
  if (conflict.Item) {
    callback(null, {
      statusCode: 403,
      headers,
      body: JSON.stringify({
        error: "Alias conflict."
      })
    })
    return
  }

  await postNewLink(event)
  callback(null, {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "Link created.",
      link: {
        alias: body.alias,
        real: body.real,
        deleteDate: body.deleteDate
      }
    })
  })
};