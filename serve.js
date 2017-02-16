var express = require('express'),
app = express(),
port = process.env.PORT || 4000;

app.use('/api', express.static(__dirname + '/dist/api', {
  setHeaders: function(res, path){
    res.header('Content-Type', 'application/vnd.api+json')
  }
}));
app.use(express.static(__dirname + '/dist'));
app.listen(port);