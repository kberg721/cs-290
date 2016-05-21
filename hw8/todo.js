var express = require('express');
var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res,next){
  var context = {};
  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }
  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length || 0;
  context.toDo = req.session.toDo || [];
  console.log(context.toDo);
  res.render('toDo',context);
});

app.post('/',function(req,res){
  var context = {};
  var data = "";

  if(req.body['New List']){
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
  }

  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }

  if(req.body['Add Item']){
     request('http://api.openweathermap.org/data/2.5/weather?q=corvallis&APPID=fa7d80c48643dfadde2cced1b1be6ca1', function(err, response, body){
      if(!err && response.statusCode < 400){
        console.log(req.body.city);
        data = JSON.parse(body);
        console.log(data.main.temp);
        if(data.main.temp < req.body.minTemp) {
          req.session.toDo.push({"name":req.body.name, "city":req.body.city, "minTemp":req.body.minTemp, "tooCold":"true", "id":req.session.curId});
        } else {
          req.session.toDo.push({"name":req.body.name, "city":req.body.city, "minTemp":req.body.minTemp, "id":req.session.curId});
        }
         req.session.curId++;
      } else {
        if(response){
          console.log(response.statusCode);
        }
        next(err);
      }
    });
  }

  if(req.body['Done']){
    req.session.toDo = req.session.toDo.filter(function(e){
      return e.id != req.body.id;
    })
  }

  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length;
  context.toDo = req.session.toDo;
  console.log(context.toDo);
  res.render('toDo',context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});