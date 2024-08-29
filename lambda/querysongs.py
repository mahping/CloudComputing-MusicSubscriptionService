import boto3
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    # Initialize a DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('music')
    
    # Retrieve the 'year', 'artist', and 'title' from the event
    year = event.get('year')
    artist = event.get('artist')
    title = event.get('title')
    
    # Create the filter expression
    filter_expression = None
    if year:
        year = int(year)  # Convert year to integer
        filter_expression = Attr('year').eq(year)
    if artist:
        artist_filter = Attr('artist').eq(artist)
        filter_expression = artist_filter if not filter_expression else filter_expression & artist_filter
    if title:
        title_filter = Attr('title').eq(title)
        filter_expression = title_filter if not filter_expression else filter_expression & title_filter

    # Prepare the scan operation
    scan_kwargs = {}
    if filter_expression:
        scan_kwargs['FilterExpression'] = filter_expression

    # Perform the scan operation on the DynamoDB table
    response = table.scan(**scan_kwargs)

    # Return the filtered items
    return {
        'statusCode': 200,
        'body': response.get('Items', [])
    }
