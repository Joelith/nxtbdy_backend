var express = require('express');
var router = express.Router();
var reader = require('feed-reader');


/* GET bus listing. */

router.get('/', function(req, res, next) {
	reader.parse('http://www.act.gov.au/feed').then(function (feed) {
		res.send(feed.entries);
	})
});

module.exports = router;
