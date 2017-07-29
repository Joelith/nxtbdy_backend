var express = require('express');
var router = express.Router();

/* GET bus listing. */

router.get('/nearest', function(req, res, next) {
	var buses = [{
		id: '200_E',
		title: '200 (To Tuggeranong)'
	}]
  res.send(buses);
});

module.exports = router;
