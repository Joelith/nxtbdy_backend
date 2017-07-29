var express = require('express');
var router = express.Router();

/* GET bus listing. */

router.get('/nearest', function(req, res, next) {
	var buses = [{
		id: '900_A',
		title: '900 (To City)'
	}]
  res.send(buses);
});

module.exports = router;
