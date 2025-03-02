import { Express } from 'express';
import { initOAuth } from './oauth';
import { initSAML } from './saml';
import { Config } from './types';

export function configureSSO(app: Express, config: Config): void {
    initOAuth(app, config.oauth);
    initSAML(app, config.saml);
}
