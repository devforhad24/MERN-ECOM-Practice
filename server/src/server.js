const express = require("express");
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.get("/test", (req,res) => {
	res.status(200).send({
		message: 'API is working fine!'
	});
});


app.listen(3001, () => {
	console.log(`server is runnig on at http://localhost:3001`);
});