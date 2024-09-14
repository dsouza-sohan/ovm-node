const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const elasticClient = require("../../elastic");

router.post("/", async (req, res) => {
  try {
    if (req.body) {
    }
    const post = await elasticClient.search({
      index: "post",
      query: {
        bool: {
          must: [
            {
              wildcard: { brand: `*${req.body.brand ?? ""}*` },
            },
            {
              wildcard: { model: `*${req.body.model ?? ""}*` },
            },
            {
              wildcard: { year: `*${req.body.year ?? ""}*` },
            },
          ],
        },
      },
    });
    res.status(200).json({
      code: 200,
      message: "Post fetched successfully",
      data: post,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

router.get("/createIndex", async (req, res) => {
  await elasticClient.indices.create({ index: "blog" });
});

module.exports = router;
