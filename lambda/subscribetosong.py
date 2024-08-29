import boto3
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('login')

    # Access email and title directly; no need for 'body' when testing via console
    email = event['email']
    user_name = event['user_name']
    song_title = event['title']

    try:
        # Get the current list of subscribed songs for the user
        response = table.get_item(
            Key={
                'email': email,
                'user_name': user_name
            },
            ProjectionExpression='#st',
            ExpressionAttributeNames={'#st': 'subscribed_songs'}
        )
        current_songs = response.get('Item', {}).get('subscribed_songs', [])
        
        # Check if the song is already in the list
        if song_title not in current_songs:
            # Update the item in the DynamoDB table if the song is not in the list
            update_response = table.update_item(
                Key={
                    'email': email,
                    'user_name': user_name  # Include the sort key in the update
                },
                UpdateExpression='SET #st = list_append(if_not_exists(#st, :empty_list), :song)',
                ExpressionAttributeNames={
                    '#st': 'subscribed_songs'
                },
                ExpressionAttributeValues={
                    ':song': [song_title],
                    ':empty_list': []
                },
                ReturnValues='UPDATED_NEW'
            )
            return {
                'statusCode': 200,
                'body': json.dumps('Subscription added successfully')
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps('Song already in subscription list')
            }

    except Exception as e:
        # Print the exception to CloudWatch logs
        print(e)
        # Return an error response
        return {
            'statusCode': 500,
            'body': json.dumps('Error adding subscription: ' + str(e))
        }
