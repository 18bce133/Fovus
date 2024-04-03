"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBTable = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const ssm = require("aws-cdk-lib/aws-ssm");
class DynamoDBTable extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.table = new dynamodb.Table(this, 'FileTable', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            stream: dynamodb.StreamViewType.NEW_IMAGE,
        });
        new ssm.StringParameter(this, 'DynamoDBTableName', {
            parameterName: '/myapp/dynamoDBTableName',
            stringValue: this.table.tableName,
        });
    }
}
exports.DynamoDBTable = DynamoDBTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vZGItdGFibGUuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZHluYW1vZGItdGFibGUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUErRDtBQUMvRCxxREFBcUQ7QUFDckQsMkNBQTJDO0FBRzNDLE1BQU0sYUFBYyxTQUFRLG1CQUFLO0lBRy9CLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNqRCxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNqRSxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLE1BQU0sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVM7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNqRCxhQUFhLEVBQUUsMEJBQTBCO1lBQ3pDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7U0FDbEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRVEsc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcclxuaW1wb3J0ICogYXMgc3NtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zc20nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmNsYXNzIER5bmFtb0RCVGFibGUgZXh0ZW5kcyBTdGFjayB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhYmxlOiBkeW5hbW9kYi5UYWJsZTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdGaWxlVGFibGUnLCB7XHJcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnaWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIHN0cmVhbTogZHluYW1vZGIuU3RyZWFtVmlld1R5cGUuTkVXX0lNQUdFLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgJ0R5bmFtb0RCVGFibGVOYW1lJywge1xyXG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnL215YXBwL2R5bmFtb0RCVGFibGVOYW1lJyxcclxuICAgICAgc3RyaW5nVmFsdWU6IHRoaXMudGFibGUudGFibGVOYW1lLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBEeW5hbW9EQlRhYmxlIH07Il19