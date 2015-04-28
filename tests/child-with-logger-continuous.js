var onExit = require('../');

onExit.logger(function(msg) {
	process.send(msg);
});

setTimeout(function() {
	throw new Error('This process should be killed before the timeout fires');
}, 1500);
