"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Bucket = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
class S3Bucket extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.bucket = new s3.Bucket(this, 'InputFileBucket', {
            bucketName: 'my-input-file-bucket',
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
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
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });
    }
}
exports.S3Bucket = S3Bucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtYnVja2V0LmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInMzLWJ1Y2tldC5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQStEO0FBQy9ELHlDQUF5QztBQUV6QyxNQUFNLFFBQVMsU0FBUSxtQkFBSztJQUkxQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNuRCxVQUFVLEVBQUUsc0JBQXNCO1lBQ2xDLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxJQUFJLEVBQUU7Z0JBQ0o7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRzt3QkFDbEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHO3dCQUNsQixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7d0JBQ25CLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTTtxQkFDdEI7b0JBQ0QsY0FBYyxFQUFFLENBQUMsdUJBQXVCLENBQUMsRUFBRSx3Q0FBd0M7b0JBQ25GLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQztpQkFDdEI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUMxRCxVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztTQUNsRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFUSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuY2xhc3MgUzNCdWNrZXQgZXh0ZW5kcyBTdGFjayB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldDogczMuQnVja2V0O1xyXG4gIHB1YmxpYyByZWFkb25seSBvdXRwdXRCdWNrZXQ6IHMzLkJ1Y2tldDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICB0aGlzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0lucHV0RmlsZUJ1Y2tldCcsIHtcclxuICAgICAgYnVja2V0TmFtZTogJ215LWlucHV0LWZpbGUtYnVja2V0JyxcclxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcclxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgY29yczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBbXHJcbiAgICAgICAgICAgIHMzLkh0dHBNZXRob2RzLkdFVCxcclxuICAgICAgICAgICAgczMuSHR0cE1ldGhvZHMuUFVULFxyXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5QT1NULFxyXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5ERUxFVEUsXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsnaHR0cDovL2xvY2FsaG9zdDozMDAwJ10sIC8vIFVwZGF0ZSB3aXRoIHlvdXIgYXBwbGljYXRpb24ncyBvcmlnaW5cclxuICAgICAgICAgIGFsbG93ZWRIZWFkZXJzOiBbJyonXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vdXRwdXRCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdPdXRwdXRGaWxlQnVja2V0Jywge1xyXG4gICAgICBidWNrZXROYW1lOiAnbXktb3V0cHV0LWZpbGUtYnVja2V0JyxcclxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcclxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgUzNCdWNrZXQgfTsiXX0=