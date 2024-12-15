const express = require('express');
const app = express();
app.use(express.json());

app.get('/', function (req, res) {
	res.send("Hi Sreecharan desu");
});

app.listen(5000, () => console.log('Server ready on port 5000.'));