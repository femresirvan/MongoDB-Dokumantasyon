// getting-started.js
const mongoose = require("mongoose");
const fs = require("fs");
const express = require("express");
const app = express();

mongoose.connect("mongodb://localhost:27017/sample");

const companySchema = new mongoose.Schema({}, { collection: "companies" });
const Company = mongoose.model("Company", companySchema);

const studentSchema = new mongoose.Schema({}, { collection: "students" });
const Student = mongoose.model("Student", studentSchema);

const gradeSchema = new mongoose.Schema({}, { collection: "grades" });
const Grade = mongoose.model("Grade", gradeSchema);

app.get("/", async (req, res) => {
  const result = await Student.aggregate([
    { $match: { _id: 0 } },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "student_id",
        pipeline: [{ $sort: { class_id: 1 } }],
        as: "scores",
      },
    },
  ]).exec();
  res.json(result);
});

app.listen(3000);
