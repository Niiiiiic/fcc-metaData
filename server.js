'use strict';

var express = require('express');
const bodyParser= require('body-parser')
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose')
var cors = require('cors');

const db = mongoose.connect(process.env.MONGO_URI)

var Schema = mongoose.Schema;

var folderSchema = new Schema({
  contentType: String,
  file: String,
  });

var folder = mongoose.model('folder', folderSchema);

var upload = multer({dest: 'uploads/'})

var app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// upload a file
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  console.log(req.file);
  var file = fs.readFileSync(req.file.path);
  var file64 = file.toString('base64');
   var filed = new folder({
    contentType: req.file.mimetype,
    file: new Buffer(file64, 'base64')
  });
  filed.save().then(saved => {
    res.json({name: req.file.originalname, type: req.file.mimetype, size: req.file.size})
  }).catch(error => {
    res.json({error: error})
  })
})

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
