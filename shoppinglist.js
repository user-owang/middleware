const express = require("express");
const app = express();
const ExpressErr = require("./ExpressError");
const items = require("./fakeDB");
const itemRoutes = require("./routes/itemRoutes");

app.use(express.json());

app.use("/items", itemRoutes);

// app.use(function (req, res, next) {
//   return new ExpressErr("Not Found", 404);
// });

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.msg,
  });
});

module.exports = app;
