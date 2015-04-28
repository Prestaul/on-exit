var onExit = require('../');

onExit.logger(function(msg) {
	process.send(msg);
});
