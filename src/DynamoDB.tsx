import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'ASIA52DQ3ZZBSHTB2D55',
        secretAccessKey: 'a9+iCAk7gLjdLrhGv8WR5+nNJMPYKd7YNyd3qUh0',
        sessionToken: 'IQoJb3JpZ2luX2VjEPX//////////wEaCXVzLXdlc3QtMiJGMEQCIGcKkCKo80dj5hqeUJ0KQBrPTBDCEtyp2rlRQOY5yqi7AiBsYuMO0uKQF9jdGIs02XGjKpu3RcZrvl0mJRRseJ/V8Cq6AgjO//////////8BEAAaDDk0OTQyNDQ3NTcxNSIMxa8mRZq/ZcCjHxeZKo4C2tSWSqY32MARMppBB7ps+tJpxzV5e9GmTzWCighFeFt4V8XhVxyONtRh1SBaMRLD8+7TzZgrC4+Vozw0iEj9Gh87pDI6Bwo5KFH964sGWJEVRUsBx72LdEOgX7dM6FR92V5UTXL5BGYxw2jmDYSI4Mw7IcFdl8h/ouU6sho3tgO+Ywp2AxrzxaTN6hnIB8mNARmasuoZ10PpLno3EEiLy0ffe2dkMn3Q1AwZEO9lwDjCgYFX6ge2/vXokjEHS707U79wJ4W3ICrpNfM7c+uzUdCC6eieBRuVj/WbL4oUlknEbmhkTYktS/r/9TpPgD3QnMnZsbsLx9WwUhxavnAsHFY3QuROlv8EHb1kiEPQMIaw2LsGOp4BYMnibiiOW3+ztB5KSlS9Z2Kkq1xz/mYjiShbgDuxk3tFiSJw/yZrLexOMcuqq29twx7lLTmhVRoG2naHZ0RVpkPvXrQmSlGqb+O4zkpFYKSGsMIsxfzHOeQBoHEuvgFl12sprrfXqWEaQwEOq+VQlC9wewuIOpMTwv8TpaXaw8gvz5Y+0z0sWCyUltsnoEyvrXHTjE7j597idpgdi/c='},
});

export const fetchItemsFromDynamoDB = async (tableName: string): Promise<any[]> => {
    try {
        const command = new ScanCommand({ TableName: tableName });
        const data = await dynamoDBClient.send(command);
        return data.Items || [];
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des éléments: ${error}`);
    }
};

export const fetchItemsFromDynamoDBByUserID = async (tableName: string, userID: number | null): Promise<any[]> => {
    try {
        const command = new ScanCommand({
            TableName: tableName,
            FilterExpression: 'UserID = :userID',
            ExpressionAttributeValues: {
                ':userID': userID,
            },
        });

        const data = await dynamoDBClient.send(command);
        return data.Items || [];
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des éléments: ${error}`);
    }
};