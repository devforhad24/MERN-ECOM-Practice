const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/api/user", isLoggedIn, (req, res) => {
  console.log(req.user.id);
  res.status(200).send({
    message: "User profile retrieved successfully!",
  });
});

app.listen(3001, () => {
  console.log(`server is runnig on at http://localhost:3001`);
});
