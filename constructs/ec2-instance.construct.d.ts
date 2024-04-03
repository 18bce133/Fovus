import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { DynamoDBTable } from './dynamodb-table.construct';
import { Construct } from 'constructs';
interface EC2InstanceProps extends StackProps {
    readonly inputBucket: s3.IBucket;
    readonly fileTable: DynamoDBTable;
    readonly outputBucket: s3.IBucket;
}
declare class EC2Instance extends Stack {
    constructor(scope: Construct, id: string, props: EC2InstanceProps);
}
export { EC2Instance };
