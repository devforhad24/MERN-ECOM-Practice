const express = require("express");

const app = express();

app.listen(3001, () => {
	console.log(`server is runnig on at http://localhost:3001`);
});