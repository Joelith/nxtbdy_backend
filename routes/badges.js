var express = require('express');
var router = express.Router();

var badges = {
	joelith: [{
		badge: 'KMs Travelled',
		progress: 334,
		goal: 500
	},{
		badge: 'Trips',
		progress: 97,
		goal: 200
	}],
	psyex : [{
		badge: 'KMs Travelled',
		progress: 34,
		goal: 500
	},{
		badge: 'Trips',
		progress: 57,
		goal: 200
	}],
	jamryl : [{
		badge: 'KMs Travelled',
		progress: 289,
		goal: 500
	},{
		badge: 'Trips',
		progress: 93,
		goal: 200
	}]
};
/* GET badges listing. */
router.get('/:user_id', function(req, res, next) {
	if (badges[req.params.user_id]) {
  	res.send(badges[req.params.user_id]);
  } else {
  	res.send([]);
  }
});

module.exports = router;
