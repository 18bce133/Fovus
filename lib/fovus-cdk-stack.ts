// Filename: fovus-cdk-stack.js

import { Stack, StackProps } from 'aws-cdk-lib';
import { S3Bucket } from '../constructs/s3-bucket.construct';
import { DynamoDBTable } from '../constructs/dynamodb-table.construct';
import { ApiGateway } from '../constructs/api-gateway.construct';
import { EC2Instance } from '../constructs/ec2-instance.construct';
import { Construct } from 'constructs';
class FovusCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3Construct = new S3Bucket(this, 'S3Buckets');
    const dynamoDBTable = new DynamoDBTable(this, 'DynamoDBTable');
    const apiGateway = new ApiGateway(this, 'ApiGateway');
    const ec2Instance = new EC2Instance(this, 'EC2Instance', {
      inputBucket: s3Construct.bucket,
      outputBucket: s3Construct.outputBucket,
      fileTable: dynamoDBTable,
    });
  }
}

export { FovusCdkStack };