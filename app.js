var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mailReaderRouter = require('./routes/MailReader');
var managerRouter= require('./routes/manager');
var eventsRouter= require('./routes/events');
var productsRouter= require('./routes/products');


var mongo =require('mongodb');
var monk =require('monk');
var db = monk ('localhost:27017/Pidev');

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.timeout = 70000000;

app.use(function(req,res,next){
	req.db=db;
	next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mail', mailReaderRouter);
app.use('/managers',managerRouter);
app.use('/events',eventsRouter);
app.use('/products',productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Pidev',{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },()=>{
    console.log('connected to mongodb')
});
module.exports = app;
