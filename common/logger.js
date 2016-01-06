var config = require('../config');

var env = process.env.NODE_ENV || "development"


var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file',
      filename: '/log/logger.log',
      maxLogSize: 1024,
      backups:3,
      category: 'Logger'
    }
  ],
	replaceConsole: true
});

var logger = log4js.getLogger('Logger');
logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')

module.exports = logger;
