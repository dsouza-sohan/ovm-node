// backend/elastic-client.js
const { Client } = require("@elastic/elasticsearch");

require("dotenv").config({ path: ".elastic.env" });

const elasticClient = new Client({
  node: "https://7c17af7f5a7f42f19fb8ad2d0c69173f.eu-west-2.aws.cloud.es.io:443",
  auth: {
    apiKey: process.env.ELASTIC_API,
  },
});

module.exports = elasticClient;
