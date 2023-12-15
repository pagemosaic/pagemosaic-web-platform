const {execSync} = require('child_process');
const {readFileSync, existsSync} = require('fs');
const {SSMClient, PutParameterCommand} = require('@aws-sdk/client-ssm');
const {
    ListUsersCommand,
    CognitoIdentityProviderClient,
    SignUpCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const {
    PARAM_PREVIEW_POINT_DOMAIN,
    PARAM_ENTRY_POINT_DOMAIN,
    PARAM_SYS_USER_POOL_ID,
    PARAM_SYS_USER_POOL_CLIENT_ID,
    PARAM_ENTRY_POINT_DISTRIBUTION_ID,
    INFRA_PREVIEW_POINT_DOMAIN,
    INFRA_ENTRY_POINT_DOMAIN,
    INFRA_SYS_USER_POOL_ID,
    INFRA_SYS_USER_POOL_CLIENT_ID,
    INFRA_ENTRY_POINT_DISTRIBUTION_ID
} = require("common-utils");

const AWS_PROFILE_NAME = process.env.AWS_PROFILE_NAME; // Get AWS profile name from environment variable
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsSessionToken = process.env.AWS_SESSION_TOKEN; // This might be optional, depending on your setup
const awsRegion = process.env.AWS_REGION;
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
const stackName = process.env.STACK_NAME;

console.log('Please wait. Deploying resources...');
// Proceed with the CDK deployment
const CDK_OUTPUT_FILE = 'cdk-outputs.json';
// const log = openSync('cdk-deploy-log.txt', 'a');
// execSync(`cdk deploy --require-approval never --auto-approve --outputs-file ${CDK_OUTPUT_FILE} --profile ${AWS_PROFILE_NAME}`, {stdio: ['ignore', log, log]});
// closeSync(log);
execSync(`cdk deploy --require-approval never --auto-approve --outputs-file ${CDK_OUTPUT_FILE} --profile ${AWS_PROFILE_NAME}`, {stdio: 'inherit'});

// console.log('Reading output.');
// Check if the output file was created
if (!existsSync(CDK_OUTPUT_FILE)) {
    console.error('Error: CDK output file not found');
    process.exit(1);
}

// Read and parse the CDK output file
const cdkOutputs = JSON.parse(readFileSync(CDK_OUTPUT_FILE, 'utf8'));
const entryPointDomainName = cdkOutputs[stackName][INFRA_ENTRY_POINT_DOMAIN];
const entryPointDistributionId = cdkOutputs[stackName][INFRA_ENTRY_POINT_DISTRIBUTION_ID];
const previewPointDomainName = cdkOutputs[stackName][INFRA_PREVIEW_POINT_DOMAIN];
const sysUserPoolId = cdkOutputs[stackName][INFRA_SYS_USER_POOL_ID];
const sysUserPoolClientId = cdkOutputs[stackName][INFRA_SYS_USER_POOL_CLIENT_ID];

// Create SSM service object
// Initialize SSM client with explicit credentials
const ssmClient = new SSMClient({
    credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
        sessionToken: awsSessionToken // Omit this if you don't use session tokens
    }
});

// Function to store parameters in SSM
const putParameter = async (name, value) => {
    const params = {
        Name: name,
        Type: 'String',
        Value: value,
        Overwrite: true
    };
    try {
        const command = new PutParameterCommand(params);
        await ssmClient.send(command);
    } catch (err) {
        console.error(`Error storing parameter ${name}:`, err);
    }
};

const cognitoClient = new CognitoIdentityProviderClient({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
        sessionToken: awsSessionToken
    }
});

const signUpAdminUser = async () => {
    try {
        // Check if there are existing users in the Sys User Pool
        const listUsersResponse = await cognitoClient.send(new ListUsersCommand({ UserPoolId: sysUserPoolId }));
        if (listUsersResponse.Users && listUsersResponse.Users.length === 0) {
            const response = await cognitoClient.send(new SignUpCommand({
                ClientId: sysUserPoolClientId,
                Username: defaultAdminEmail,
                Password: 'DefaultPassword1!',
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: defaultAdminEmail
                    },
                    {
                        Name: 'name',
                        Value: 'Admin User'
                    },
                ]
            }));
            console.log("Sign up successful", response);
        }
    } catch (error) {
        console.error("Error during sign up", error);
    }
};

putParameter(PARAM_ENTRY_POINT_DOMAIN, entryPointDomainName)
    .then(() => {
        return putParameter(PARAM_PREVIEW_POINT_DOMAIN, previewPointDomainName);
    })
    .then(() => {
        return putParameter(PARAM_SYS_USER_POOL_ID, sysUserPoolId);
    })
    .then(() => {
        return putParameter(PARAM_SYS_USER_POOL_CLIENT_ID, sysUserPoolClientId);
    })
    .then(() => {
        return putParameter(PARAM_ENTRY_POINT_DISTRIBUTION_ID, entryPointDistributionId);
    })
    .then(() => {
        return signUpAdminUser();
    })
    .then(() => {
        console.log('It seems that the platform has been successfully deployed.');
        console.log(`Please open the website at: https://${entryPointDomainName}`);
        console.log(`Please open the admin panel at: https://${entryPointDomainName}/admin`);
    })
    .catch(error => {
        console.error(error.message);
    });
