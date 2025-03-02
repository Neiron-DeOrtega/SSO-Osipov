import express from 'express';
import { configureSSO } from './main';
import { Config } from './types';
import dotenv from 'dotenv';
import passport from 'passport';
const cors = require('cors');
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 

const samlCert = fs.readFileSync(process.env.SAML_CERT_PATH!, 'utf8');

const config: Config = {
    oauth: {
        clientId: process.env.OAUTH_CLIENT_ID || '',
        clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
        callbackUrl: process.env.OAUTH_CALLBACK_URL || '',
        authUrl: process.env.OAUTH_AUTH_URL || '',
        tokenUrl: process.env.OAUTH_TOKEN_URL || '',
        userInfoUrl: process.env.OAUTH_USER_INFO_URL || '',
        provider: process.env.OAUTH_PROVIDER || 'google',
    },
    saml: {
        entryPoint: process.env.SAML_ENTRY_POINT || '',
        issuer: process.env.SAML_ISSUER || '',
        cert: samlCert || '',
        callbackUrl: process.env.SAML_CALLBACK_URL || '',
    },
};

app.use(passport.initialize());
configureSSO(app, config);

app.get('/', (req, res) => {
    res.send('server is running')
})

import { AppDataSource } from './database/data-source';

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');

        app.listen(process.env.PORT, () => {
            console.log(`Server started on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
