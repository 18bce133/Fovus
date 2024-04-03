import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
declare class S3Bucket extends Stack {
    readonly bucket: s3.Bucket;
    readonly outputBucket: s3.Bucket;
    constructor(scope: Construct, id: string, props?: StackProps);
}
export { S3Bucket };
