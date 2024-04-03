// lambdas/file-processing/index.js
const { EC2Client, RunInstancesCommand } = require("@aws-sdk/client-ec2");

exports.handler = async (event) => {
  try {
    for (const record of event.Records){
      if (record['eventName'] == "INSERT")
      {  
        const { INPUT_BUCKET_NAME, OUTPUT_BUCKET_NAME, FILE_TABLE_NAME, SCRIPT_BUCKET_NAME } = process.env;
        const newFileId = event.Records[0].dynamodb.Keys.id.S;

        // Create the EC2 instance
        const params = {
          ImageId: 'ami-0cff7528ff583bf9a', // Replace with your desired AMI ID
          InstanceType: 't2.micro',
          MinCount: 1,
          MaxCount: 1,
          IamInstanceProfile: {
            Name: 'EC2ForFovus', // Use the instance profile name created by CDK
          },
          TagSpecifications: [
            {
              ResourceType: 'instance',
              Tags: [
                {
                  Key: 'Name',
                  Value: newFileId,
                },
              ],
            },
          ],
          UserData: Buffer.from(
            `#!/bin/bash
            sudo exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
              
            # Install the AWS CLI and other dependencies
            sudo yum update -y
            sudo yum install -y aws-cli
            export FILE_TABLE_NAME=${FILE_TABLE_NAME}
            export INPUT_BUCKET_NAME=${INPUT_BUCKET_NAME}
            export OUTPUT_BUCKET_NAME=${OUTPUT_BUCKET_NAME}
            export ID=${newFileId}
            sudo aws s3 cp s3://${SCRIPT_BUCKET_NAME}/script.sh ./script.sh
            sudo chmod +x ./script.sh
            ./script.sh
            sudo shutdown now -h`).toString('base64'),
        };

        const ec2 = new EC2Client({ region: "us-east-1" });
        const command = new RunInstancesCommand(params);
        const response = await ec2.send(command);
        const instanceId = response.Instances[0].InstanceId;

        console.log(`EC2 instance ${instanceId} created successfully`);
        return { statusCode: 200, body: `EC2 instance ${instanceId} created successfully` };
      }
      else {
        return { statusCode: 200, body: 'No new records found' };
      }
    }
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: 'Failed to create EC2 instance' };
  }
};
