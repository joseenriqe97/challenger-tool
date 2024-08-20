const express = require('express');
const fileRouter = require('./src/router');
const { PORT } = require('./config.json');
const logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use('/', fileRouter);


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


const server = app.listen(PORT, () => {
  console.log('Server is running on port', server.address().port);
});

module.exports = app;

