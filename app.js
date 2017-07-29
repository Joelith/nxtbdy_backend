var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var index = require('./routes/index');
//var users = require('./routes/users');
var chat = require('./routes/chat');
var bus = require('./routes/bus');
var news = require('./routes/news');
var badges = require('./routes/badges');

var app = express();

app.use(cors())

var io = require('socket.io')();
app.io = io;

var chat_store = {};
var user_store = {};

io.on('connection', function (socket) {
	console.log('emitting');

 	socket.on('room', function(room, user) {
 		console.log('client joining room', room, user);
    socket.join(room);
    socket.room = room;
    if (!user_store[room]) user_store[room] = [];
    // Check if they are already registered in the room
    var found = false;
    for (var i = 0; i < user_store[room].length; i++) {
    	if (user_store[room][i].username == user.username) {
    		found = true;
    		break;
    	}
    }
    if (!found) user_store[room].push(user);

    // Send history
    console.log('  sending history', chat_store[room])
    if (chat_store[room]) socket.emit('message', chat_store[room]);
    console.log('  telling everyone user joined', user);
    io.sockets.in(socket.room).emit('user_join', user_store[room]);
  });
  socket.on('message', function (data) {
  	if (!chat_store[socket.room]) chat_store[socket.room] = [];
  	chat_store[socket.room].push(data);
  	if (chat_store[socket.room].length > 10) chat_store[socket.room].shift()

  	io.sockets.in(socket.room).emit('message', data);

  	console.log('A client from room', socket.room, 'sent a message', data.message)
  })
})

app.use(function(req,res,next) {
  req.users = user_store;
  next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use('/chat', chat);
app.use('/bus', bus);
app.use('/news', news);
app.use('/badges', badges);
//app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
