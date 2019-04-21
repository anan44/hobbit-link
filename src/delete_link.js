'use strict';
const aws = require('aws-sdk')
const dynamoDb = new aws.DynamoDB.DocumentClient()

const checkSecret = async (alias, secret) => {
  const params = {
    TableName: "LinkTable",
    Key: {
      alias: alias
    }
  }
  try {
    const { Item } = await dynamoDb.get(params).promise()
    if (Item.secret === secret) {
      console.log("Same secret")
      return true
    }
    console.log("Wrong secret")
    return false 
  } catch(e) {
    console.log(e)
    return false
  }
}

module.exports.delete_link = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const aliasLink = event.pathParameters.link
  const dynamoParams = {
    TableName: "LinkTable",
    Key: {
      alias: aliasLink,
    }
  }
  const sameSecret = await checkSecret(aliasLink, body.secret)
  if (sameSecret) {
    dynamoDb.delete(dynamoParams).promise()
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: "Link deleted."
      })
    })
  } else {
    callback(null, {
      statusCode: 403,
      body: JSON.stringify({
        message: "Incorrect secret & link combination."
      })
    })
  }

}