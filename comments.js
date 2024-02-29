//create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

//configure web server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//create database
var Datastore = require('nedb');
var db = new Datastore({filename: 'comments.db', autoload: true});

//create server
app.listen(3000, function(){
	console.log('Server listening on port 3000');
});

//create API
app.get('/api/comments', function(req, res){
	db.find({}, function(err, docs){
		res.json(docs);
	});
});

app.post('/api/comments', function(req, res){
	var comment = req.body;
	db.insert(comment, function(err, newDoc){
		res.json(newDoc);
	});
});

app.get('/api/comments/:id', function(req, res){
	var id = req.params.id;
	db.findOne({_id: id}, function(err, doc){
		res.json(doc);
	});
});

app.put('/api/comments/:id', function(req, res){
	var id = req.params.id;
	var comment = req.body;
	db.update({_id: id}, comment, {}, function(err, numReplaced){
		res.json({message: 'success'});
	});
});

app.delete('/api/comments/:id', function(req, res){
	var id = req.params.id;
	db.remove({_id: id}, {}, function(err, numRemoved){
		res.json({message: 'success'});
	});
});

//create web page
app.get('/', function(req, res){
	fs.createReadStream('index.html').pipe(res);
});