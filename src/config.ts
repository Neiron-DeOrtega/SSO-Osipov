import dotenv from 'dotenv';
import fs from 'fs';
import { Config } from './types';

dotenv.config();

const config: Config = {
    oauth: {
        clientId: process.env.OAUTH_CLIENT_ID!,
        clientSecret: process.env.OAUTH_CLIENT_SECRET!,
        callbackUrl: process.env.OAUTH_CALLBACK_URL!,
        authUrl: process.env.OAUTH_AUTH_URL!,
        tokenUrl: process.env.OAUTH_TOKEN_URL!,
        userInfoUrl: process.env.OAUTH_USER_INFO_URL!,
        provider: process.env.OAUTH_PROVIDER!,
    },
    saml: {
        entryPoint: process.env.SAML_ENTRY_POINT!,
        issuer: process.env.SAML_ISSUER!,
        cert: fs.readFileSync(process.env.SAML_CERT_PATH!, 'utf-8'),
        callbackUrl: process.env.SAML_CALLBACK_URL!,
    },
};

export default config;
