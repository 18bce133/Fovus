export INPUT_TEXT=$(aws dynamodb get-item --region us-east-1 --table-name $FILE_TABLE_NAME --key '{"id":{"S":"'"$ID"'"}}' --query 'Item.input_text.S' --output text)
export INPUT_FILE_PATH=$(aws dynamodb get-item --region us-east-1 --table-name $FILE_TABLE_NAME --key '{"id":{"S":"'"$ID"'"}}' --query 'Item.input_file_path.S' --output text)
# Download the input file from S3
export INPUT_FILE_NAME=$(echo $INPUT_FILE_PATH | awk -F'/' '{print $NF}')
aws s3 --region us-east-1 cp $INPUT_FILE_PATH $INPUT_FILE_NAME
# Create the output file
export OUTPUT_FILE_NAME=$(uuidgen).txt
#sudo echo "$(cat $INPUT_FILE_NAME) : $INPUT_TEXT" > $OUTPUT_FILE_NAME
# Write the input file contents and the input text to the output file
echo "$(cat $INPUT_FILE_NAME) : $INPUT_TEXT" > ~/temp_file

# Copy the temporary file to the output file with sudo
cp ~/temp_file $OUTPUT_FILE_NAME

# Clean up the temporary file
rm ~/temp_file

# Upload the output file to S3
export OUTPUT_FILE_PATH=$(echo $INPUT_FILE_PATH | awk -F'/' '{print $1}')//$OUTPUT_BUCKET_NAME/$OUTPUT_FILE_NAME
aws s3 --region us-east-1 cp $OUTPUT_FILE_NAME $OUTPUT_FILE_PATH
# Save the output file path in DynamoDB
aws dynamodb update-item --region us-east-1 --table-name $FILE_TABLE_NAME --key '{"id":{"S":"'"$ID"'"}}' --update-expression "SET output_file_path = :path" --expression-attribute-values '{":path":{"S":"'"$OUTPUT_FILE_PATH"'"}}'
