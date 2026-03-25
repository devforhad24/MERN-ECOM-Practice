const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const isLoggedIn = (req, res, next) => {
  const login = true;

  if (login) {
    req.user = { id: 101 };
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "API is working fine!",
  });
});

app.get("/api/users", isLoggedIn, (req, res) => {
  console.log(req.user.id);
  res.status(200).send({
    message: "User profile retrieved successfully!",
  });
});

// client side error handling
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
  next();
});

// server side error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3001, () => {
  console.log(`server is runnig on at http://localhost:3001`);
});
