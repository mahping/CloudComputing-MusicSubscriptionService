import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('login')
    
    # Extract data from event
    email = event['email']
    username = event['username']
    password = event['password']
    
    # Check if the email already exists in the table
    response = table.query(
        KeyConditionExpression=Key('email').eq(email)
    )
    
    if response['Items']:
        # If any items returned, then email already exists
        return {
            'statusCode': 400,
            'body': 'The email already exists'
        }
    
    # Prepare the item to insert
    item = {
        'email': email,
        'user_name': username,
        'password': password
    }
    
    # Try to insert the item into the DynamoDB table
    try:
        table.put_item(Item=item)
        return {
            'statusCode': 200,
            'body': 'Registration successful'
        }
    except ClientError as e:
        print(f"Error saving the user: {e}")
        return {
            'statusCode': 500,
            'body': 'Registration failed'
        }
