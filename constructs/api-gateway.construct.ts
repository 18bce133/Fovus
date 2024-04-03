// Filename: api-gateway.construct.ts

import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

class ApiGateway extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fileUploadLambda = new lambda.Function(this, 'FileUploadLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambdas/file-upload'),
      handler: 'index.handler',
      environment: {
        FILE_TABLE_NAME: ssm.StringParameter.valueForStringParameter(this, '/myapp/dynamoDBTableName')
      },
    });
    fileUploadLambda.role?.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess',
    });
    const api = new apigw.RestApi(this, 'ApiGateway', {
      restApiName: 'FileProcessingApi',
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent'],
        allowCredentials: true,
      },
      deployOptions: {
        tracingEnabled: true,
      },
    });

    const fileUploadResource = api.root.addResource('fileUpload');
    const fileUploadIntegration = new apigw.LambdaIntegration(fileUploadLambda);

    const fileUploadMethod = fileUploadResource.addMethod(
      'POST',
      fileUploadIntegration,
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
            },
          },
        ],
      }
    );

    // Store the API Gateway URL in Parameter Store
    const apiGatewayUrl = api.url;
    new ssm.StringParameter(this, 'ApiGatewayUrlParameter', {
      parameterName: '/myapp/apiGatewayUrl',
      stringValue: apiGatewayUrl,
    });
  }
}

export { ApiGateway };