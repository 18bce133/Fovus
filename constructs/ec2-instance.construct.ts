import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { DynamoDBTable } from './dynamodb-table.construct';
import { Construct } from 'constructs';

interface EC2InstanceProps extends StackProps {
  readonly inputBucket: s3.IBucket;
  readonly fileTable: DynamoDBTable;
  readonly outputBucket: s3.IBucket;
}

class EC2Instance extends Stack {
  constructor(scope: Construct, id: string, props: EC2InstanceProps) {
    super(scope, id, props);

    const scriptBucket = new s3.Bucket(this, 'ScriptBucket', {
      bucketName: 'ec2-script-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
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

    fileProcessingLambda.addEventSource(
      new lambdaEventSources.DynamoEventSource(fileTable.table, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
      })
    );

    inputBucket.grantRead(fileProcessingLambda);
    scriptBucket.grantRead(fileProcessingLambda);
    fileTable.table.grantReadWriteData(fileProcessingLambda);
  }
}

export { EC2Instance };