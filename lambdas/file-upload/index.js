const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

exports.handler = async (event) => {
  let nanoid;

  try {
    const module = await import('nanoid');
    nanoid = module.nanoid;
  } catch (err) {
    console.error('Failed to load nanoid:', err);
  }

  const { FILE_TABLE_NAME } = process.env;
  const { inputText, inputFilePath } = JSON.parse(event.body);
  const id = nanoid();

  const dynamodb = new DynamoDBClient({ region: "us-east-1" });

  const params = {
    TableName: FILE_TABLE_NAME,
    Item: {
      id: { S: id },
      input_text: { S: inputText },
      input_file_path: { S: inputFilePath },
    },
  };

  const command = new PutItemCommand(params);

  try {
    await dynamodb.send(command);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE'
      },
      body: JSON.stringify('Data storage completed successfully'),
    };
    return response;
  } catch (err) {
    console.error('Error:', err.stack);
    return { statusCode: 500, body: 'Data storage failed' };
  }
};