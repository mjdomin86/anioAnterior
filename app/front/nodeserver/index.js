var express = require('express'),
  var path = require('path'),
    var router = express.Router();
var fs = require('fs');
var app = express();
var staticRoot = __dirname + '/';

app.set('port', (process.env.FRONT_PORT));
app.use(express.static(staticRoot));

// serve angular front end files from root path
router.use('/', express.static('app', { redirect: false }));

// rewrite virtual urls to angular app to enable refreshing of internal pages
router.get('*', function (req, res, next) {
    res.sendFile(path.resolve('app/index.html'));
});

module.exports = router;

app.use(function (req, res, next) {

  // if the request is not html then move along
  var accept = req.accepts('html', 'json', 'xml');
  if (accept !== 'html') {
    return next();
  }

  // if the request has a '.' assume that it's for a file, move along
  var ext = path.extname(req.path);
  if (ext !== '') {
    return next();
  }

  fs.createReadStream(staticRoot + 'index.html').pipe(res);

});

app.listen(app.get('port'), function () {
  console.log('front running on port', app.get('port'));
});
