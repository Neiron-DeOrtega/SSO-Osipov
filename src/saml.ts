import { Express } from 'express';
import passport, { DoneCallback } from 'passport';
const SamlStrategy = require('passport-saml').Strategy;
import { Profile } from 'passport-saml';
import { Config } from './types';

const findByEmail = (email: any, callback: any) => {
    if (email === 'test@example.com') {
        callback(null, { id: 1, email });
      } else {
        callback(null, null);
      }
}

export function initSAML(app: Express, samlConfig: Config['saml']) { 
    passport.use(
        new SamlStrategy(
            {
                path: samlConfig.callbackUrl,
                entryPoint: samlConfig.entryPoint,
                issuer: samlConfig.issuer,
                cert: samlConfig.cert,
            },
            (profile: Profile, done: DoneCallback) => {
                done(null, profile);
            }
        )
    );
    

    app.get('/auth/saml', passport.authenticate('saml'));

    app.post(
        '/auth/saml/callback',
        passport.authenticate('saml', { failureRedirect: '/login' }),
        (req, res) => {
            res.redirect('/');
        }
    );
    
    app.get('/login', (req, res) => {
        res.send('Login page'); 
    });
    
}
