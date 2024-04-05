// frontend/src/FileUpload.js

import React, { useRef } from 'react';
import { S3 } from 'aws-sdk';
import config from './config.json';

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: config.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: config.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const s3 = new S3({ region: 'us-east-1', credentials: { accessKeyId: config.REACT_APP_AWS_ACCESS_KEY_ID, secretAccessKey: config.REACT_APP_AWS_SECRET_ACCESS_KEY }});
const ssm = new AWS.SSM();

async function getApiGatewayUrl() {
  const data = await ssm.getParameter({
    Name: '/myapp/apiGatewayUrl',
    WithDecryption: true,
  }).promise();

  return data.Parameter.Value;
}

const FileUpload = () => {
  
  const inputTextRef = useRef(null);
  const inputFileRef = useRef(null);

  const handleSubmit = async (e) => {
  
    e.preventDefault();
    const inputText = inputTextRef.current.value;
    const inputFile = inputFileRef.current.files[0];

    // Upload the file to S3
    const inputFileName = inputFile.name;
    const s3Params = {
      Bucket: 'my-input-file-bucket',
      Key: inputFileName,
      Body: inputFile,
    };

    try {
      // Upload the file to S3
      await s3.putObject(s3Params).promise();

      // Get the API Gateway URL from AWS Systems Manager Parameter Store
      const apiGatewayUrl = `${await getApiGatewayUrl()}fileUpload`;

      console.log('DynamoDB Table Name:', ssm.getParameter({Name: '/myapp/dynamoDBTableName'}).promise());
      // Send the input text and S3 file path to the API Gateway endpoint
      const requestBody = {
        inputText,
        inputFilePath: `s3://${s3Params.Bucket}/${s3Params.Key}`,
      };
      const apiResponse = await fetch(apiGatewayUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (apiResponse.ok) {
        console.log('File upload and data storage completed successfully');
      } else {
        console.error('File upload and data storage failed');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="inputText">Input Text:</label>
        <input type="text" id="inputText" ref={inputTextRef} />
      </div>
      <div>
        <label htmlFor="inputFile">Input File:</label>
        <input type="file" id="inputFile" ref={inputFileRef} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FileUpload;