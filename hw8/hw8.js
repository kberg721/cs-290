/*
  Author: Kyle Bergman
  CS290: Node Assignment
*/

/*setting up express and handlebars*/
var express = require('express');
var session = require('express-session');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'MySecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3001);

/* Session count example */
app.get('/count', function(req, res) {
  var context = {};
  context.count = req.session.count || 0;
  req.session.count = context.count + 1;
  res.render('counter', countext);
});

/* handling get requests */
app.get('/home',function(req,res){
  //where we will store our key value pairs
  var queryArr = [];

  //for each item in our query string, add it to our array
  for (var p in req.query){
    queryArr.push({'name':p,'value':req.query[p]})
  }

  //the object we will pass to our template
  var context = {};

  //set the dataList property to our array of key value pairs
  context.dataList = qParams;

  //render the 'home-get' page and give it our key value pairs
  res.render('home-get', context);
});

/* handling post requests */
app.post('/home', function(req,res){

  //store all of the key value pairs passed to the query string
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]})
  }

  //store all of the key value pairs passed to the body
  var bParams = [];
  for (var p in req.body){
    bParams.push({'name':p,'value':req.body[p]})
  }

  //create the object that will store our two lists of key value pairs
  var context = {};
  context.queryList = qParams;        //queryList holds all query KV pairs
  context.bodyList = bParams;         //bodyList holds all body KV pairs
  res.render('home-post', context);   //render our answer page and send it our KV pairs
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});



