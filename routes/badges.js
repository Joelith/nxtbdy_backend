var express = require('express');
var router = express.Router();

var badges = {
	joelith: [{
		icon : '',
		title : 'Weekly Warrior',
		description: 'Travelled everyday in a week'
	}]
};
/* GET badges listing. */
router.get('/:user_id', function(req, res, next) {
  res.send(badges[req.params.user_id]);
});

module.exports = router;
