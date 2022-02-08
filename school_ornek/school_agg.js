app.get("/", async (req, res) => {
  const result = await Student.aggregate([
    { $match: { _id: 0 } },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "student_id",
        as: "scores",
      },
    },
  ]).exec();
  res.json(result);
});
