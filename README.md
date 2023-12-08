# Page Mosaic Web Platform v0

This project was developed as part of the creation of the Page Mosaic Web Platform. 
It can be used as a foundation for developing a website on Remix with content administration capabilities through an Admin Panel.

The technical stack used in the project includes:

* AWS CDK
* AWS SDK
* Express
* Remix
* AWS Remix adapter
* React Router V6
* Shadcn UI
* Tailwind CSS
* Vite
* Rollup

The following diagram illustrates the general concept of this project. 
An administrator inputs data into the database, and users see the updated data on the website.
   <p>
      <img src="https://github.com/pagemosaic/.github/blob/36e15782758f81fd8f2ee6589931ac1041e2af6f/images/v0/fig-1.png" alt="Fig-1.png" width="50%" />
   </p>

This project is specifically designed for the AWS platform, so you will need to create or use an existing AWS account. 
There's no need to worry about cluttering your account with unwanted resources. 
The project uses AWS CDK, which leverages CloudFormation, ensuring all resources are created within a single CloudFormation Stack. 
This design allows for the easy deletion of all resources created within this stack.

The project is structured to facilitate the easy deployment of all necessary resources with just one command.

## Deployment

* Before deploying the project, you must create an administrative user on your AWS account and configure the AWS CLI on your computer, as shown in the video below.
   <p>
      <a href="https://youtu.be/5_UlOTywdOA" target="_blank">
   <img src="https://github.com/pagemosaic/.github/blob/main/images/website_starter_videos_covers/create_admin_on_aws.png" alt="SSL certificate issuing" width="45%"/>
      </a>
   </p>

Once you have successfully created an administrative user and set up AWS CLI access, you can proceed to build and deploy the project on your account. 
You will need to specify the necessary credentials for AWS CDK to initialize the resources correctly.

* Change the `.env.example` file name to `.env` and edit its contents. Specifically, include the following variables:
   * `STACK_NAME` - any name you like. You can check existing stacks in the AWS console under CloudFormation.
   * `AWS_REGION` - the name of the AWS region where resources will be deployed (some resources like CloudFront will be deployed globally)
   * `AWS_PROFILE_NAME` - the profile name for AWS CLI authorization (see the video above)
   * `DEFAULT_ADMIN_EMAIL` - the administrative user's email (see the video above)

* Use the following command to install the AWS Cloud Development Kit (CDK) Toolkit globally on your system:
```shell
npm install -g aws-cdk
```

* Install dependencies:
```shell
pnpm install
```

* Run CDK Bootstrap (only once if not previously done):
```shell
pnpm bootstrap-platform
```

* Now you can deploy the project on AWS. Run the following command in the project's root directory:
```shell
pnpn deploy-platform
```

You can see how this is done in the following video.
(видео сборки и развертывания веб-сайта)

## AWS Resource Scheme

   <p>
      <img src="https://github.com/pagemosaic/.github/blob/31a5c8e2e6f6036af667edc177570c4f4759e925/images/v0/fig-2.png" alt="Fig-2.png" width="50%" />
   </p>

## Project Code Structure

### local-run

This module functions similarly to the cross-env library.
```json
{
  "scripts": {
     "start": "local-run <some command>"
  }
}
```

It reads AWS credentials and runs commands with these credentials.
(рисунок как это работает)
 

### common-utils

This module contains common types and utilities used by other modules.
(рисунок с общим модулем)

### admin-pwa

Implementation of the Admin Panel.
(схема работы)

(скриншоты)

Used stack:
* React Router V6 (data router)
* Shadcn UI
* Tailwind CSS
* Vite

### api

REST interface for the Admin Panel
(схема работы)

Used stack:
* Exress
* AWS SDK
* Rollup

### web-adapter

An adapter for Remix to be used in AWS lambda. 
Parts of the code are taken from the `architect` library in the `remix.run` repository.
(схема работы)

Used stack:
* AWS SDK
* Rollup

### web-app

A Remix application for the website.
(схема работы)

Used stack:
* AWS SDK
* Remix
* Tailwind CSS 
* Vite 
* Rollup

### infra

This module is responsible for initializing AWS resources and deploying files to AWS.
(рисунок как работает)

Used stack:
* AWS CLI
* AWS CDK
* AWS SDK
* Rollup

## Developing and Running Modules Locally

All modules are locally run through `local-run` to work with remote AWS resources (Cognito, DynamoDB, S3). 

The Admin Panel web application is run locally using Vite in development mode. 
To start, execute the command from the root directory:
```shell
pnpm admin-pwa
```

When the Admin Panel is running locally, requests to the REST API also go to the local computer. 
Therefore, the api module must be run locally in parallel. 
The api module is also run locally using Vite in development mode.  
```shell
pnpm api
```

The web-app module can be developed separately from the Admin Panel. 
This module is run locally using Vite in development mode with the command:
```shell
pnpm web-app
```

## Removing AWS Resources

To remove resources created on AWS during deployment, run the command:
```shell
pnpm destroy-platform
```

Afterward, resources created for DynamoDB (tables with data) and S3 buckets may remain on AWS. 
You can easily identify them as their names begin with the stack name you specified in the `.env` file under `STACK_NAME`. 
Go to the AWS console and manually delete them after successfully executing the destroy-platform command.

