var express = require('express');
var router = express.Router();

/* POST facts listing. */
router.post('/:bus_id', function(req, res, next) {
	var found = false;
	var msg = {
		message: req.body.fact,
		from_name : 'factbot',
		from_id : 'factbot'
	}
	for (var room_id in req.io.sockets.adapter.rooms) {
		if (room_id == req.params.bus_id) {
			found = true;
			console.log('Sending fact to', room_id);

			req.io.sockets.in(room_id).emit('message', msg);
			if (!req.chat_store[room_id]) req.chat_store[room_id] = [];
  		req.chat_store[room_id].push(msg);
		}
	}
	if (!found) {
		res.send('unknown bus');
	} else {
		res.send('Fact Sent');
	}

//	io.sockets.in(socket.room).emit('user_join', user_store[room]);
});

module.exports = router;
