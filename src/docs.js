'use strict';
const uuid = require("uuid")

module.exports.get_docs = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Here will be the documentation for this thing',
      name: "Janne",
      uuid: uuid.v1()
    }),
  };
};
