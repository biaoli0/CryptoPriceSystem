import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { REGION } from "../constants";

export const fetchSecretKey = async (secretName: string) => {
    const client = new SecretsManagerClient({
        region: REGION,
    });

    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT",
            })
        );
        const apiKeyString = response.SecretString || '';
        return JSON.parse(apiKeyString);
    } catch (error) {
        console.error(`Error retrieving API key ${secretName}: `, error);
        throw new Error(`Failed to retrieve API key ${secretName}`);
    }
};