const {execSync} = require('child_process');
const {openSync, closeSync} = require('fs');

const AWS_PROFILE_NAME = process.env.AWS_PROFILE_NAME; // Get AWS profile name from environment variable

console.log('Please wait. Destroying resources...');
// Proceed with the CDK deployment
const log = openSync('cdk-destroy-log.txt', 'a');
execSync(`cdk destroy --force --profile ${AWS_PROFILE_NAME}`, {stdio: ['ignore', log, log]});
closeSync(log);
