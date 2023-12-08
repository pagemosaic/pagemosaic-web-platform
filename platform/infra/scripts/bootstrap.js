const {execSync} = require('child_process');
const {openSync, closeSync} = require('fs');

const AWS_PROFILE_NAME = process.env.AWS_PROFILE_NAME; // Get AWS profile name from environment variable

console.log('Please wait. Bootstraping resources...');
// Proceed with the CDK deployment
const log = openSync('cdk-bootstrap-log.txt', 'a');
execSync(`cdk bootstrap --profile ${AWS_PROFILE_NAME}`, {stdio: ['ignore', log, log]});
closeSync(log);
