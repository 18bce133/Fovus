import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
declare class ApiGateway extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps);
}
export { ApiGateway };
