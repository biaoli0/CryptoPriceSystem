
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { object, string } from 'yup';

const queryParamsSchema = object({
    email: string().email().required()
});

export const handler: Handler = async (event: APIGatewayEvent) => {
    try {
        const { email } = await queryParamsSchema.validate(event.queryStringParameters);
        const input = {
            "EmailAddress": email
        };
        const client = new SESClient();
        const command = new VerifyEmailIdentityCommand(input);
        await client.send(command);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Verification email sent successfully',
                note: 'Please check your email to complete verification',
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Error adding email identity',
                error
            })
        };
    }
};


