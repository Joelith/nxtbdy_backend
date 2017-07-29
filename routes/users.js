var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:bus_id', function(req, res, next) {
  res.send(req.users[req.param.bus_id]);
});

module.exports = router;
