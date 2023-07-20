const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

var transport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    transport,
  ]

})
module.exports = logger
