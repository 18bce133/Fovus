# Fovus CDK Project
This is a Cloud Development Kit (CDK) project for deploying infrastructure and services on AWS using TypeScript. The project includes an API Gateway, DynamoDB table, EC2 instance, S3 bucket, and Lambda functions for file processing and file upload.

## Prerequisites
- Node.js (v14.x or later)
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)

## Project Structure
- `bin/`: Contains the CDK app entry point
- `constructs/`: Contains reusable constructs for various AWS resources
- `frontend/`: Contains the React frontend application
- `lambdas/`: Contains Lambda function code and dependencies
- `lib/`: Contains the main CDK stack definition

## Getting Started
1. Clone the repository
2. Install project dependencies: `npm install`
3. Set AWS credentials:
   - `setx AWS_ACCESS_KEY_ID=`
   - `setx AWS_SECRET_ACCESS_KEY=`
   - OR 
   - `set AWS_ACCESS_KEY_ID=`
   - `set AWS_SECRET_ACCESS_KEY=`
4. Bootstrap the CDK environment again: `npm run cdk bootstrap`
5. Deploy the CDK stack: `npm run cdk deploy -- --all --require-approval never`
6. Navigate to the `frontend` directory: `cd frontend`
7. Install frontend dependencies: `npm install`
8. Start the frontend development server: `npm start`
9.  Open the app in your browser at `http://localhost:3000`
10. Enter Text and upload a file to the S3 bucket. A sample file is provided in the root directory with name `sample_upload.txt`.
11. Output file will be stored in the S3 bucket named `my-output-file-bucket` and also stored in DynamoDB. 
12. After successful execution, you destroy the resources using `npm run cdk destroy -- --all`.

## Frontend
The frontend application is a React app that allows users to upload files to the S3 bucket.

## Lambda Functions
The project includes two Lambda functions:

1. **File Processing Lambda**: This function is triggered by an DynamoDBEvent whenever a new data is added to the Dynamodb. It launches a new EC2 instance which processes the file and stores the output file path in the DynamoDB table.

2. **File Upload Lambda**: This function is invoked by the API Gateway when a user uploads a file through the frontend application. It stores input text and input filepath to DynamoDB.

## Useful CDK Commands
- `npm run build`: Compile the TypeScript code to JavaScript
- `cdk ls`: List all stacks in the app
- `cdk synth`: Synthesize the CloudFormation template for the stack
- `cdk deploy`: Deploy the stack to your AWS account
- `cdk diff`: Compare deployed stack with current state
- `cdk destroy`: Destroy the stack and all resources

## Resources
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [AWS CDK Toolkit](https://github.com/aws/aws-cdk)
