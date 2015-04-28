var assert = require('chai').assert,
	path = require('path'),
	childProcess = require('child_process');

function validateProcess(child, done) {
	var count = 0;

	child.on('message', function(data) {
		count += 1;
		assert.strictEqual(data, count, 'child process should output numeric counter value');
	});

	child.on('close', function() {
		assert.strictEqual(count, 3, 'child process should output exactly 3 values');
		done();
	});
}

function validateLogger(child, signal, done) {
	var loggedSignal = false,
		loggedExit = false;

	child.on('message', function(data) {
		if(signal && ~data.indexOf('Recieved')) {
			if(~data.indexOf(signal)) {
				loggedSignal = true;
			} else {
				throw new Error('Logged unexpected signal: ' + data);
			}
		} else if(~data.indexOf('exit handlers')) {
			loggedExit = true;
		} else {
			throw new Error('Logged unexpected message: ' + data);
		}
	});

	child.on('close', function() {
		if(signal) {
			assert.isTrue(loggedSignal, 'on-exit should log the ' + signal + ' signal');
		}
		assert.isTrue(loggedExit, 'on-exit should log the exit event');
		done();
	});
}

describe('on-exit', function() {
	it('should fire handlers', function(done) {
		var child = childProcess.fork(path.join(__dirname, 'child-simple.js'));

		validateProcess(child, done);
	});

	it('should fire handlers on SIGTERM', function(done) {
		var child = childProcess.fork(path.join(__dirname, 'child-continuous.js'));

		validateProcess(child, done);

		setTimeout(function() {
			child.kill();
		}, 100);
	});

	it('should fire handlers on SIGINT', function(done) {
		var child = childProcess.fork(path.join(__dirname, 'child-continuous.js'));

		validateProcess(child, done);

		setTimeout(function() {
			child.kill('SIGINT');
		}, 100);
	});

	it('should call the logger correctly', function(done) {
		var child = childProcess.fork(path.join(__dirname, 'child-with-logger.js'));

		validateLogger(child, false, done);
	});

	it('should call the logger correctly on SIGTERM', function(done) {
		var child = childProcess.fork(path.join(__dirname, 'child-with-logger-continuous.js'));

		validateLogger(child, 'SIGTERM', done);

		setTimeout(function() {
			child.kill();
		}, 100);
	});

	it('should call the logger correctly on SIGINT', function(done) {
		var child = childProcess.fork(path.join(__dirname, 'child-with-logger-continuous.js'));

		validateLogger(child, 'SIGINT', done);

		setTimeout(function() {
			child.kill('SIGINT');
		}, 100);
	});
});
