var express = require('express');
var router = express.Router();

/* GET bus listing. */
router.get('/messages/:bus_id', function(req, res, next) {
  res.send('bus');
});

module.exports = router;
