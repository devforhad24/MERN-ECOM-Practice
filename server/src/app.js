const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");

const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mili sec to 1 Minute
  max: 5,
  message: "Too many request from this IP!. Please try again later",
});

app.use(rateLimiter);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users',userRouter);
app.use('/api/seed',seedRouter);

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "API is working fine!",
  });
});


// client side error handling
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// server side error handling -> all
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
