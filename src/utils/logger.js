const chalk = require('chalk');

const timestamp = () => new Date().toLocaleTimeString('en-US', { hour12: false });

const logger = {
  info: (msg) => console.log(`${chalk.gray(timestamp())} ${chalk.blue('[INFO]')} ${msg}`),
  success: (msg) => console.log(`${chalk.gray(timestamp())} ${chalk.green('[OK]')} ${msg}`),
  warn: (msg) => console.log(`${chalk.gray(timestamp())} ${chalk.yellow('[WARN]')} ${msg}`),
  error: (msg) => console.log(`${chalk.gray(timestamp())} ${chalk.red('[ERR]')} ${msg}`),
  music: (msg) => console.log(`${chalk.gray(timestamp())} ${chalk.magenta('[MUSIC]')} ${msg}`),
};

module.exports = logger;
