/*
  Kyle Bergman
  CS290
  Databases Assignment
  Server-side JS
*/
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//home page populate with database contents
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home', context);
  }); 
});

//edit page, prepopulate form with previous data
app.get('/edit-data',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts WHERE id = ?',[req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    var date = new Date(rows[0].date);
    var dateString = date.getFullYear() + "-" 
    if(date.getMonth() < 10) {
      dateString += "0" + (date.getMonth()+1) + "-";
    } else {
      dateString += (date.getMonth()+1) + "-";
    } 
    if(date.getUTCDate() < 10) {
      dateString += "0" + date.getUTCDate();
    } else {
      dateString += date.getUTCDate();
    } 
    context.date = dateString;

    if(rows[0].lbs == 1) {
      context.checked = true;
    } 
    res.render('edit-data', context);
  });
});

function convertMonthNameToNumber(monthName) {
    var myDate = new Date(monthName + " 1, 2000");
    var monthDigit = myDate.getMonth();
    return isNaN(monthDigit) ? 0 : (monthDigit + 1);
}

app.post('/', function(req, res, next) {
  if(req.body.btn == "Add") {
    var name = req.body.name;
    if(name.length > 0) {
      var reps = req.body.reps;
      var weight = req.body.weight;
      var date = req.body.date;
      var unit = "";
      if(req.body.unit == "lbs") {
          unit = 1;
      } else {
          unit = 0;
      }
      //insert new value into table
      mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
        [name, reps, weight, date, unit], function(err, rows, fields){
        if(err){
          next(err); 
          return;
        }
        //retrieve updated database rows
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
          if(err) {
            next(err);
            return;
          }
          res.status(200).send(JSON.stringify(rows));
        });
      });
    }
  }

  if(req.body.btn == "Delete") {
    //delete row from table
    mysql.pool.query("DELETE FROM workouts WHERE id = ?", 
      [req.body.id], function(err, rows, fields) {
      if(err) {
        next(err); 
        return;
      }
      //retrieve updated table
      mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields) {
        if(err) {
          next(err);
          return;
        }
        res.status(200).send(JSON.stringify(rows));
      });
    });
  }

  if(req.body.btn == "Edit") {
    var context = {};
    var name = req.body.name;
    var reps = req.body.reps;
    var weight = req.body.weight;
    var date = req.body.date;
    var unit = "";
    if(req.body.unit == "lbs") {
        unit = 1;
    } else {
        unit = 0;
    }
    //update row in table
    mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
    [name, reps, weight, date, unit, req.body.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
     res.status(200).send(null);
  });
  }


});

app.get('/reset-table',function(req,res,next){
  var context = {};
  //replace your connection pool with the your variable containing the connection pool
   mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});







