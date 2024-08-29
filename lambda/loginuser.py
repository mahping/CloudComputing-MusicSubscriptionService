import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    # Initialize a DynamoDB client
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('login')

    # Extract email and password from the event
    email = event['email']
    password = event['password']

    # Perform a query to find the user by email
    response = table.query(
        KeyConditionExpression=Key('email').eq(email)
    )

    # Check if the user exists and the password matches
    if response['Items']:
        user = response['Items'][0]
        if user['password'] == password:
            return {
                'statusCode': 200,
                'body': {
                    'message': 'Login successful',
                    'username': user['user_name']  # Ensure the key matches the column name in DynamoDB
                }
            }
        else:
            return {'statusCode': 400, 'body': {'message': 'Email or password is invalid'}}
    else:
        return {'statusCode': 400, 'body': {'message': 'Email or password is invalid'}}
