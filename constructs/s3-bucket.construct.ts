import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
class S3Bucket extends Stack {
  public readonly bucket: s3.Bucket;
  public readonly outputBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'InputFileBucket', {
      bucketName: 'my-input-file-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['http://localhost:3000'], // Update with your application's origin
          allowedHeaders: ['*'],
        },
      ],
    });

    this.outputBucket = new s3.Bucket(this, 'OutputFileBucket', {
      bucketName: 'my-output-file-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}

export { S3Bucket };