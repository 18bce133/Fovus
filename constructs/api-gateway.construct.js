"use strict";
// Filename: api-gateway.construct.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGateway = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const apigw = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ssm = require("aws-cdk-lib/aws-ssm");
class ApiGateway extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
        const fileUploadMethod = fileUploadResource.addMethod('POST', fileUploadIntegration, {
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
        });
        // Store the API Gateway URL in Parameter Store
        const apiGatewayUrl = api.url;
        new ssm.StringParameter(this, 'ApiGatewayUrlParameter', {
            parameterName: '/myapp/apiGatewayUrl',
            stringValue: apiGatewayUrl,
        });
    }
}
exports.ApiGateway = ApiGateway;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWdhdGV3YXkuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWdhdGV3YXkuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQ0FBcUM7OztBQUVyQyw2Q0FBZ0Q7QUFDaEQsb0RBQW9EO0FBQ3BELGlEQUFpRDtBQUNqRCwyQ0FBMkM7QUFHM0MsTUFBTSxVQUFXLFNBQVEsbUJBQUs7SUFDNUIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUM7WUFDbEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsV0FBVyxFQUFFO2dCQUNYLGVBQWUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSwwQkFBMEIsQ0FBQzthQUMvRjtTQUNGLENBQUMsQ0FBQztRQUNILGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQztZQUN0QyxnQkFBZ0IsRUFBRSxrREFBa0Q7U0FDckUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDaEQsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQywyQkFBMkIsRUFBRTtnQkFDM0IsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNuQixZQUFZLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDO2dCQUN6RCxZQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsc0JBQXNCLEVBQUUsa0JBQWtCLENBQUM7Z0JBQ3RILGdCQUFnQixFQUFFLElBQUk7YUFDdkI7WUFDRCxhQUFhLEVBQUU7Z0JBQ2IsY0FBYyxFQUFFLElBQUk7YUFDckI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlELE1BQU0scUJBQXFCLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUU1RSxNQUFNLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FDbkQsTUFBTSxFQUNOLHFCQUFxQixFQUNyQjtZQUNFLGVBQWUsRUFBRTtnQkFDZjtvQkFDRSxVQUFVLEVBQUUsS0FBSztvQkFDakIsa0JBQWtCLEVBQUU7d0JBQ2xCLG9EQUFvRCxFQUFFLElBQUk7d0JBQzFELHFEQUFxRCxFQUFFLElBQUk7d0JBQzNELHFEQUFxRCxFQUFFLElBQUk7d0JBQzNELHlEQUF5RCxFQUFFLElBQUk7cUJBQ2hFO2lCQUNGO2FBQ0Y7U0FDRixDQUNGLENBQUM7UUFFRiwrQ0FBK0M7UUFDL0MsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUM5QixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ3RELGFBQWEsRUFBRSxzQkFBc0I7WUFDckMsV0FBVyxFQUFFLGFBQWE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRVEsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlbmFtZTogYXBpLWdhdGV3YXkuY29uc3RydWN0LnRzXHJcblxyXG5pbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xyXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcblxyXG5jbGFzcyBBcGlHYXRld2F5IGV4dGVuZHMgU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgY29uc3QgZmlsZVVwbG9hZExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0ZpbGVVcGxvYWRMYW1iZGEnLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNl9YLFxyXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYXMvZmlsZS11cGxvYWQnKSxcclxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxyXG4gICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgIEZJTEVfVEFCTEVfTkFNRTogc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcih0aGlzLCAnL215YXBwL2R5bmFtb0RCVGFibGVOYW1lJylcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gICAgZmlsZVVwbG9hZExhbWJkYS5yb2xlPy5hZGRNYW5hZ2VkUG9saWN5KHtcclxuICAgICAgbWFuYWdlZFBvbGljeUFybjogJ2Fybjphd3M6aWFtOjphd3M6cG9saWN5L0FtYXpvbkR5bmFtb0RCRnVsbEFjY2VzcycsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHRoaXMsICdBcGlHYXRld2F5Jywge1xyXG4gICAgICByZXN0QXBpTmFtZTogJ0ZpbGVQcm9jZXNzaW5nQXBpJyxcclxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XHJcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBbJyonXSxcclxuICAgICAgICBhbGxvd01ldGhvZHM6IFsnR0VUJywgJ1BPU1QnLCAnUFVUJywgJ0RFTEVURScsICdPUFRJT05TJ10sXHJcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBbJ0NvbnRlbnQtVHlwZScsICdBdXRob3JpemF0aW9uJywgJ1gtQW16LURhdGUnLCAnWC1BcGktS2V5JywgJ1gtQW16LVNlY3VyaXR5LVRva2VuJywgJ1gtQW16LVVzZXItQWdlbnQnXSxcclxuICAgICAgICBhbGxvd0NyZWRlbnRpYWxzOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XHJcbiAgICAgICAgdHJhY2luZ0VuYWJsZWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBmaWxlVXBsb2FkUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnZmlsZVVwbG9hZCcpO1xyXG4gICAgY29uc3QgZmlsZVVwbG9hZEludGVncmF0aW9uID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKGZpbGVVcGxvYWRMYW1iZGEpO1xyXG5cclxuICAgIGNvbnN0IGZpbGVVcGxvYWRNZXRob2QgPSBmaWxlVXBsb2FkUmVzb3VyY2UuYWRkTWV0aG9kKFxyXG4gICAgICAnUE9TVCcsXHJcbiAgICAgIGZpbGVVcGxvYWRJbnRlZ3JhdGlvbixcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZFJlc3BvbnNlczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgLy8gU3RvcmUgdGhlIEFQSSBHYXRld2F5IFVSTCBpbiBQYXJhbWV0ZXIgU3RvcmVcclxuICAgIGNvbnN0IGFwaUdhdGV3YXlVcmwgPSBhcGkudXJsO1xyXG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgJ0FwaUdhdGV3YXlVcmxQYXJhbWV0ZXInLCB7XHJcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvbXlhcHAvYXBpR2F0ZXdheVVybCcsXHJcbiAgICAgIHN0cmluZ1ZhbHVlOiBhcGlHYXRld2F5VXJsLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBBcGlHYXRld2F5IH07Il19