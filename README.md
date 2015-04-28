# on-exit

Easily register tasks to perform when the current node process exits.


# Install

```bash
npm install on-exit
```


## Usage
Call onExit one or more times to add process cleanup tasks:

```js
var onExit = require('on-exit');

onExit(function() {
	console.log('Closing db connections...');
	db.close();
});

onExit(function() {
	console.log('Performing other cleanup...');
	app.cleanup();
});
```

When the process exits handlers will be run in the order that they were added.


## Debug logs
You can set a logging function if you would like to log kill signals and exit events:

```js
var onExit = require('on-exit').logger(function(msg) {
    myCustomLogger.log(msg);
});

// Or to console.log
onExit.logger(console.log.bind(console));
```
