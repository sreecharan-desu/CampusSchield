const express = require('express');
const app = express();
app.use(express.json());

app.get('/', function (req, res) {
	res.send("Hi");
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;