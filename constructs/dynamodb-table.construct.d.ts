import { Stack, StackProps } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
declare class DynamoDBTable extends Stack {
    readonly table: dynamodb.Table;
    constructor(scope: Construct, id: string, props?: StackProps);
}
export { DynamoDBTable };
