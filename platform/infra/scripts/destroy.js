const {execSync} = require('child_process');
const {openSync, closeSync} = require('fs');

const {DeleteParameterCommand, SSMClient, GetParameterCommand} = require("@aws-sdk/client-ssm");
const {ACMClient, DeleteCertificateCommand} = require('@aws-sdk/client-acm');

const {
    PARAM_PREVIEW_POINT_DOMAIN,
    PARAM_ENTRY_POINT_DOMAIN,
    PARAM_SYS_USER_POOL_ID,
    PARAM_SYS_USER_POOL_CLIENT_ID,
    PARAM_ENTRY_POINT_DISTRIBUTION_ID,
    PARAM_SSL_CERTIFICATE_ARN,
    PARAM_DOMAIN
} = require("common-utils");

const AWS_PROFILE_NAME = process.env.AWS_PROFILE_NAME; // Get AWS profile name from environment variable

console.log('Please wait. Destroying resources...');
// Proceed with the CDK deployment
// const log = openSync('cdk-destroy-log.txt', 'a');
// execSync(`cdk destroy --force --profile ${AWS_PROFILE_NAME}`, {stdio: ['ignore', log, log]});
// closeSync(log);
execSync(`cdk destroy --force --profile ${AWS_PROFILE_NAME}`, {stdio: 'inherit'});

// Create SSM service object
// Initialize SSM client with explicit credentials
const ssmClient = new SSMClient();

const acmClient = new ACMClient({region: 'us-east-1'});

async function getSsmParameter(parameterName) {
    try {
        const command = new GetParameterCommand({Name: parameterName});
        const response = await ssmClient.send(command);
        return response.Parameter?.Value;
    } catch (e) {
        ///
    }
    return undefined;
}

async function delSsmParameter(parameterName) {
    const params = {
        Name: parameterName
    };
    try {
        const command = new DeleteParameterCommand(params);
        await ssmClient.send(command);
    } catch (err) {
        console.error(`Error deleting parameter ${parameterName}:`, err);
    }
}

async function deleteSSLCertificate(certificateArn) {
    try {
        const deleteCertificateCommand = new DeleteCertificateCommand({CertificateArn: certificateArn});
        await acmClient.send(deleteCertificateCommand);
    } catch (e) {
        console.error(e);
    }
}

async function finalCleaning(){
    const certificateArn = await getSsmParameter(PARAM_SSL_CERTIFICATE_ARN);

    await delSsmParameter(PARAM_ENTRY_POINT_DISTRIBUTION_ID);
    await delSsmParameter(PARAM_ENTRY_POINT_DOMAIN);
    await delSsmParameter(PARAM_PREVIEW_POINT_DOMAIN);
    await delSsmParameter(PARAM_SYS_USER_POOL_CLIENT_ID);
    await delSsmParameter(PARAM_SYS_USER_POOL_ID);
    await delSsmParameter(PARAM_DOMAIN);
    await delSsmParameter(PARAM_SSL_CERTIFICATE_ARN);

    if (certificateArn) {
        await deleteSSLCertificate(certificateArn);
    }
}

finalCleaning().catch(e => console.error(e));
