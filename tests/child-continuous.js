var onExit = require('../');

function send(val) {
	return function() {
		process.send(val);
	};
}

onExit(send(1));
onExit(send(2));
onExit(send(3));

setTimeout(function() {
	throw new Error('This process should be killed before the timeout fires');
}, 1500);
