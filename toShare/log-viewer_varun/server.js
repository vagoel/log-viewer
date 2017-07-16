const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
})
app.use("/bower_components", express.static(__dirname + '/bower_components'));
app.use("/app", express.static(__dirname + '/app'));

app.get('/file/:name', function (req, res) {

	var fileName = req.params.name;
	var filepath = '/server/log/' + fileName;

	var fileExists = fs.existsSync(__dirname + filepath);

	if (fileExists) {
		res.sendFile(filepath, {
			root: __dirname
		});
	} else {
		res.status(404).send('Sorry, we cannot find that file on server! Please type log or access_log or error_log');
	}

})

app.listen(3000, function () {
	console.log('App listening on port 3000!')
})