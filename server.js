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
	var page=req.query.page?req.query.page:1;
	var size=req.query.size?req.query.size:10;

	var getFileContent=function(data,page,size){
		var dataArray=data.trim('').split(/\n/);
		var totalPages=Math.ceil(dataArray.length/size);

		return dataArray.slice((page-1)*size,page*size);
	}

	var getTotalRecords=function(data){
		return data.trim('').split(/\n/).length;
	}

	if (fileExists) {
		fs.readFile(__dirname+filepath, 'utf8',(err, data) => {
			if (err) throw err;
			res.send({records:getFileContent(data,page,size),meta:{totalRecords:getTotalRecords(data)}});
		});
	} else {
		res.status(404).send('Sorry, we cannot find that file on server! Please type log or access_log or error_log');
	}

})

var server=app.listen(3000, function () {
	console.log('App listening on port 3000!')
})

module.exports = server;