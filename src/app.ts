import express, { Request, Response } from 'express';
import { configureSSO } from './main';
import { Config } from './types';
import dotenv from 'dotenv';
import passport from 'passport';
const cors = require('cors');
import fs from 'fs';
const jwt = require('jsonwebtoken')

dotenv.config();

export const createServer = (config: Config) => {
    const app = express();
    app.use(express.json());
    app.use(cors()); 
    
    const oauthConfig = config.oauth;
    const samlConfig = config.saml;
    
    app.use(passport.initialize());
    configureSSO(app, {oauth: oauthConfig, saml: samlConfig});
    
    app.get('/', (req, res) => {
        res.status(200).send('Server is running')
    })
    
    app.get('/protected', (req: Request, res: Response): any => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            jwt.verify(token!, process.env.JWT_SECRET!);
            return res.sendStatus(200)
        } catch (error) {
            return res.status(403).send(error)
        }
    })

    return app
    
}

