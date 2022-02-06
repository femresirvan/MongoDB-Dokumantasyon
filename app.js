// getting-started.js
const mongoose = require("mongoose");
const fs = require("fs");
const express = require("express");
const app = express();

mongoose.connect("mongodb://localhost:27017/samples");

const companySchema = new mongoose.Schema({}, { collection: "companies" });

const Company = mongoose.model("Company", companySchema);

app.get("/", async (req, res) => {
  const result = await Company.aggregate([
    // a ismini barındıran çalışanların isimlerine göre (a'dan z'ye) sorting yapıp ilk 20 recordu basan algoritma.
    // !Mutlaka limit'ten önce sorting işlemi yapmalısınız.
    { $unwind: "$relationships" },
    { $match: { "relationships.person.first_name": { $in: [/.a/] } } },
    { $project: { relationships: 1, _id: 0, name: 1 } },
    { $sort: { "relationships.person.first_name": 1 } },
    { $limit: 20 },

    // ? Debugging Stage
    //// { $count: "Total records" },
  ]).exec();
  res.json(result);
});

app.listen(3000);
