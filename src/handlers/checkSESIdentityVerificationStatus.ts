import { GetIdentityVerificationAttributesCommand, SESClient } from "@aws-sdk/client-ses";

export const checkSESIdentityVerificationStatus = async (email: string) => {
    const client = new SESClient();
    const input = {
        Identities: [
            email,
        ],
    };
    const command = new GetIdentityVerificationAttributesCommand(input);
    const response = await client.send(command);
    if (!response.VerificationAttributes) {
        throw new Error('Fail to get verification status');
    }

    return response.VerificationAttributes[email].VerificationStatus;
};