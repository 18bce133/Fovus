"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EC2Instance = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const lambda = require("aws-cdk-lib/aws-lambda");
const lambdaEventSources = require("aws-cdk-lib/aws-lambda-event-sources");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const iam = require("aws-cdk-lib/aws-iam");
class EC2Instance extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const scriptBucket = new s3.Bucket(this, 'ScriptBucket', {
            bucketName: 'ec2-script-bucket',
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });
        new s3deploy.BucketDeployment(this, 'DeployScript', {
            sources: [s3deploy.Source.asset('lambdas/file-processing/script.zip')],
            destinationBucket: scriptBucket,
        });
        const inputBucket = s3.Bucket.fromBucketName(this, 'InputFileBucket', props.inputBucket.bucketName);
        const fileTable = props.fileTable;
        const outputBucket = s3.Bucket.fromBucketName(this, 'OutputFileBucket', props.outputBucket.bucketName);
        // Create IAM role for EC2 instance
        const ec2Role = new iam.Role(this, 'EC2Role', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'),
            ],
        });
        const ec2InstanceProfile = new iam.CfnInstanceProfile(this, 'EC2InstanceProfile', {
            instanceProfileName: 'EC2ForFovus',
            roles: [ec2Role.roleName],
        });
        const fileProcessingLambdaPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'ec2:RunInstances',
                'ec2:TerminateInstances',
                'ec2:CreateTags',
                'ec2:DescribeInstances',
                'ec2:DescribeImages',
                'ec2:DescribeAvailabilityZones',
                'ec2:DescribeSecurityGroups',
                'ec2:DescribeSubnets',
                'ec2:DescribeVpcs',
                'iam:PassRole',
                'iam:CreateRole',
                'iam:AttachRolePolicy',
                's3:GetObject',
                'dynamodb:GetItem',
            ],
            resources: ['*'],
        });
        const fileProcessingLambda = new lambda.Function(this, 'FileProcessingLambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('./lambdas/file-processing'),
            handler: 'index.handler',
            environment: {
                INPUT_BUCKET_NAME: inputBucket.bucketName,
                OUTPUT_BUCKET_NAME: outputBucket.bucketName,
                SCRIPT_BUCKET_NAME: scriptBucket.bucketName,
                FILE_TABLE_NAME: fileTable.table.tableName,
            },
            initialPolicy: [fileProcessingLambdaPolicy],
        });
        fileProcessingLambda.addEventSource(new lambdaEventSources.DynamoEventSource(fileTable.table, {
            startingPosition: lambda.StartingPosition.LATEST,
            batchSize: 1,
        }));
        inputBucket.grantRead(fileProcessingLambda);
        scriptBucket.grantRead(fileProcessingLambda);
        fileTable.table.grantReadWriteData(fileProcessingLambda);
    }
}
exports.EC2Instance = EC2Instance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLWluc3RhbmNlLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjMi1pbnN0YW5jZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQStEO0FBQy9ELHlDQUF5QztBQUN6QyxpREFBaUQ7QUFDakQsMkVBQTJFO0FBQzNFLDBEQUEwRDtBQUMxRCwyQ0FBMkM7QUFXM0MsTUFBTSxXQUFZLFNBQVEsbUJBQUs7SUFDN0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN2RCxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztTQUNsRCxDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDdEUsaUJBQWlCLEVBQUUsWUFBWTtTQUNoQyxDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2xDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxrQkFB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YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcclxuaW1wb3J0ICogYXMgbGFtYmRhRXZlbnRTb3VyY2VzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XHJcbmltcG9ydCAqIGFzIHMzZGVwbG95IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1kZXBsb3ltZW50JztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xyXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XHJcbmltcG9ydCB7IER5bmFtb0RCVGFibGUgfSBmcm9tICcuL2R5bmFtb2RiLXRhYmxlLmNvbnN0cnVjdCc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuaW50ZXJmYWNlIEVDMkluc3RhbmNlUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcclxuICByZWFkb25seSBpbnB1dEJ1Y2tldDogczMuSUJ1Y2tldDtcclxuICByZWFkb25seSBmaWxlVGFibGU6IER5bmFtb0RCVGFibGU7XHJcbiAgcmVhZG9ubHkgb3V0cHV0QnVja2V0OiBzMy5JQnVja2V0O1xyXG59XHJcblxyXG5jbGFzcyBFQzJJbnN0YW5jZSBleHRlbmRzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRUMySW5zdGFuY2VQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgY29uc3Qgc2NyaXB0QnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnU2NyaXB0QnVja2V0Jywge1xyXG4gICAgICBidWNrZXROYW1lOiAnZWMyLXNjcmlwdC1idWNrZXQnLFxyXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxyXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveVNjcmlwdCcsIHtcclxuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldCgnbGFtYmRhcy9maWxlLXByb2Nlc3Npbmcvc2NyaXB0LnppcCcpXSxcclxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNjcmlwdEJ1Y2tldCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGlucHV0QnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHRoaXMsICdJbnB1dEZpbGVCdWNrZXQnLCBwcm9wcy5pbnB1dEJ1Y2tldC5idWNrZXROYW1lKTtcclxuICAgIGNvbnN0IGZpbGVUYWJsZSA9IHByb3BzLmZpbGVUYWJsZTtcclxuICAgIGNvbnN0IG91dHB1dEJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZSh0aGlzLCAnT3V0cHV0RmlsZUJ1Y2tldCcsIHByb3BzLm91dHB1dEJ1Y2tldC5idWNrZXROYW1lKTtcclxuXHJcbiAgICAvLyBDcmVhdGUgSUFNIHJvbGUgZm9yIEVDMiBpbnN0YW5jZVxyXG4gICAgY29uc3QgZWMyUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnRUMyUm9sZScsIHtcclxuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXHJcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xyXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uU1NNTWFuYWdlZEluc3RhbmNlQ29yZScpLFxyXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uUzNSZWFkT25seUFjY2VzcycpLFxyXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uUzNGdWxsQWNjZXNzJyksXHJcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25EeW5hbW9EQkZ1bGxBY2Nlc3MnKSxcclxuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVDMkZ1bGxBY2Nlc3MnKSxcclxuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0Nsb3VkV2F0Y2hGdWxsQWNjZXNzJyksXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlYzJJbnN0YW5jZVByb2ZpbGUgPSBuZXcgaWFtLkNmbkluc3RhbmNlUHJvZmlsZSh0aGlzLCAnRUMySW5zdGFuY2VQcm9maWxlJywge1xyXG4gICAgICBpbnN0YW5jZVByb2ZpbGVOYW1lOiAnRUMyRm9yRm92dXMnLFxyXG4gICAgICByb2xlczogW2VjMlJvbGUucm9sZU5hbWVdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZmlsZVByb2Nlc3NpbmdMYW1iZGFQb2xpY3kgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgYWN0aW9uczogW1xyXG4gICAgICAgICdlYzI6UnVuSW5zdGFuY2VzJyxcclxuICAgICAgICAnZWMyOlRlcm1pbmF0ZUluc3RhbmNlcycsXHJcbiAgICAgICAgJ2VjMjpDcmVhdGVUYWdzJyxcclxuICAgICAgICAnZWMyOkRlc2NyaWJlSW5zdGFuY2VzJyxcclxuICAgICAgICAnZWMyOkRlc2NyaWJlSW1hZ2VzJyxcclxuICAgICAgICAnZWMyOkRlc2NyaWJlQXZhaWxhYmlsaXR5Wm9uZXMnLFxyXG4gICAgICAgICdlYzI6RGVzY3JpYmVTZWN1cml0eUdyb3VwcycsXHJcbiAgICAgICAgJ2VjMjpEZXNjcmliZVN1Ym5ldHMnLFxyXG4gICAgICAgICdlYzI6RGVzY3JpYmVWcGNzJyxcclxuICAgICAgICAnaWFtOlBhc3NSb2xlJyxcclxuICAgICAgICAnaWFtOkNyZWF0ZVJvbGUnLFxyXG4gICAgICAgICdpYW06QXR0YWNoUm9sZVBvbGljeScsXHJcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXHJcbiAgICAgICAgJ2R5bmFtb2RiOkdldEl0ZW0nLFxyXG4gICAgICBdLFxyXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZmlsZVByb2Nlc3NpbmdMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdGaWxlUHJvY2Vzc2luZ0xhbWJkYScsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE2X1gsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9sYW1iZGFzL2ZpbGUtcHJvY2Vzc2luZycpLFxyXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgSU5QVVRfQlVDS0VUX05BTUU6IGlucHV0QnVja2V0LmJ1Y2tldE5hbWUsXHJcbiAgICAgICAgT1VUUFVUX0JVQ0tFVF9OQU1FOiBvdXRwdXRCdWNrZXQuYnVja2V0TmFtZSxcclxuICAgICAgICBTQ1JJUFRfQlVDS0VUX05BTUU6IHNjcmlwdEJ1Y2tldC5idWNrZXROYW1lLFxyXG4gICAgICAgIEZJTEVfVEFCTEVfTkFNRTogZmlsZVRhYmxlLnRhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgfSxcclxuICAgICAgaW5pdGlhbFBvbGljeTogW2ZpbGVQcm9jZXNzaW5nTGFtYmRhUG9saWN5XSxcclxuICAgIH0pO1xyXG5cclxuICAgIGZpbGVQcm9jZXNzaW5nTGFtYmRhLmFkZEV2ZW50U291cmNlKFxyXG4gICAgICBuZXcgbGFtYmRhRXZlbnRTb3VyY2VzLkR5bmFtb0V2ZW50U291cmNlKGZpbGVUYWJsZS50YWJsZSwge1xyXG4gICAgICAgIHN0YXJ0aW5nUG9zaXRpb246IGxhbWJkYS5TdGFydGluZ1Bvc2l0aW9uLkxBVEVTVCxcclxuICAgICAgICBiYXRjaFNpemU6IDEsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIGlucHV0QnVja2V0LmdyYW50UmVhZChmaWxlUHJvY2Vzc2luZ0xhbWJkYSk7XHJcbiAgICBzY3JpcHRCdWNrZXQuZ3JhbnRSZWFkKGZpbGVQcm9jZXNzaW5nTGFtYmRhKTtcclxuICAgIGZpbGVUYWJsZS50YWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZmlsZVByb2Nlc3NpbmdMYW1iZGEpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgRUMySW5zdGFuY2UgfTsiXX0=