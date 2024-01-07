import {execSync} from 'child_process';
import {readFileSync, existsSync} from 'fs';
import {
    ListUsersCommand,
    CognitoIdentityProviderClient,
    SignUpCommand,
    ListUsersResponse
} from '@aws-sdk/client-cognito-identity-provider';
import {
    PARAM_PREVIEW_POINT_DOMAIN,
    PARAM_ENTRY_POINT_DOMAIN,
    PARAM_SYS_USER_POOL_ID,
    PARAM_SYS_USER_POOL_CLIENT_ID,
    PARAM_ENTRY_POINT_DISTRIBUTION_ID,
    INFRA_PREVIEW_POINT_DOMAIN,
    INFRA_ENTRY_POINT_DOMAIN,
    INFRA_SYS_USER_POOL_ID,
    INFRA_SYS_USER_POOL_CLIENT_ID,
    INFRA_ENTRY_POINT_DISTRIBUTION_ID,
    INFRA_USER_BUCKET_NAME,
    PARAM_USER_BUCKET_NAME
} from '../common/constants';
import {getCognitoClient} from '../common/aws/sysAuth';
import {putSsmParameter} from '../common/aws/sysParameters';

const AWS_PROFILE_NAME = process.env.AWS_PROFILE_NAME;
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
const stackName = process.env.STACK_NAME || '';

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
const userBucketName = cdkOutputs[stackName][INFRA_USER_BUCKET_NAME];

const postDeploy = async () => {
    try {
        await putSsmParameter(PARAM_ENTRY_POINT_DOMAIN, entryPointDomainName);
        await putSsmParameter(PARAM_PREVIEW_POINT_DOMAIN, previewPointDomainName);
        await putSsmParameter(PARAM_SYS_USER_POOL_ID, sysUserPoolId);
        await putSsmParameter(PARAM_SYS_USER_POOL_CLIENT_ID, sysUserPoolClientId);
        await putSsmParameter(PARAM_ENTRY_POINT_DISTRIBUTION_ID, entryPointDistributionId);
        await putSsmParameter(PARAM_USER_BUCKET_NAME, userBucketName);

        const cognitoClient: CognitoIdentityProviderClient = await getCognitoClient();
        // Check if there are existing users in the Sys User Pool
        const listUsersResponse: ListUsersResponse = await cognitoClient.send(new ListUsersCommand({ UserPoolId: sysUserPoolId }));
        if (listUsersResponse && listUsersResponse.Users && listUsersResponse.Users.length === 0) {
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
            console.log("Sign up successful.", response);
        }
    } catch (error) {
        console.error("Error during post-deploy.", error);
    }
};

postDeploy()
    .then(() => {
        console.log('It seems that the platform has been successfully deployed.');
        console.log(`Please open the website at: https://${entryPointDomainName}`);
        console.log(`Please open the admin panel at: https://${entryPointDomainName}/admin`);
    })
    .catch(error => {
        console.error(error.message);
    });
