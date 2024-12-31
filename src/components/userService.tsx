import { dynamoDBClient } from './DynamoDB.tsx'; // Assurez-vous que le client DynamoDB est configuré
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
// @ts-ignore
import bcrypt from 'bcryptjs';

const USERS_TABLE = 'Users';

export const registerUser = async (email: string, password: string, name: string, firstname: string, image: string, role: string): Promise<void> => {
    try {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hachage du mot de passe
        const timestamp = Date.now();

        const command = new PutCommand({
            TableName: USERS_TABLE,
            Item: {
                ID: timestamp,
                Email: email,
                Password: hashedPassword,
                Name: name,
                FirstName: firstname,
                Image: image,
                Role: role
            },
            ConditionExpression: 'attribute_not_exists(Email)',
        });
        await dynamoDBClient.send(command);
    } catch (error) {
        throw new Error(`Erreur d'inscription: ${error}`);
    }
};

export const loginUser = async (email: string, password: string): Promise<{ ID: number; name: string, firstname: string, email: string, role: string, image: string }> => {
    try {
        const command = new ScanCommand({
            TableName: USERS_TABLE,
            FilterExpression: 'Email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        });

        const data = await dynamoDBClient.send(command);

        if (!data.Items || data.Items.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        const user = data.Items[0];
        const passwordMatch = bcrypt.compareSync(password, user.Password);

        if (!passwordMatch) {
            throw new Error('Mot de passe incorrect');
        }

        return {
            ID: user.ID,
            name: user.Name,
            firstname: user.FirstName,
            email: user.Email,
            role: user.Role,
            image: user.Image

        };
    } catch (error) {
        // @ts-ignore
        throw new Error(`Erreur de connexion: ${error.message}`);
    }
};