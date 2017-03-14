#! /usr/bin/env node

const bssClient = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const karma = require('karma');
const path = require('path');

// Format console logging
const Logger = {
  info(message) {
    console.log(
      chalk.blue.bgWhite(message)
    );
  },

  error(message) {
    console.log(
      chalk.red(message)
    );
  },

  success(message) {
    console.log(
      chalk.green(message)
    );
  },

  blanck() {
    console.log('\n');
  }
};

/**
 * Unit test for module, component, all modules
 * Example: bss-client test:unit admin
 *        : bss-client test:unit admin -c register 
 */
bssClient
  .command('test:unit <module_name>')
  .description('for unit test')
  .option('-c, --component <component>', 'the component name')
  .action((moduleName, options) => {
    // Load karma configuration file to define test files
    const config = karma.config.parseConfig(path.resolve('./karma.conf.js'));
    let testFilePath = options.component
                   ? `${moduleName}/${options.component}/*.spec.js`
                   : `${moduleName}/**/*.spec.js`;
    config.set(
      {
        files: [testFilePath],
        preprocessors: {
          [`${testFilePath}`]: ['webpack']
        }
      }
    );
    const server = new karma.Server(config);
    server.start();
  });

/**
 * Install dependencies, npm link
 */
bssClient
  .command('setup')
  .description('setup client')
  .action((options) => {
    // Link this client - log to console while linking
    Logger.info('Setting up client...');
    Logger.blanck();
    execSync('yarn install && yarn link', { encoding: 'utf-8', stdio: 'inherit' });
  });

/**
 * Start development server, bundling, and opens browser
 */
bssClient
  .command('start:dev <moduleName>')
  .action(moduleName => {
    Logger.info('Starting client develoment server...');
    require('../devserver')({moduleName});
    //execSync(`NODE_ENV=development Module=${moduleName} node devserver.js`, {stdio: 'inherit'});
  });

// All commands should add before
bssClient.parse(process.argv);
