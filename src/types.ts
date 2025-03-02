export interface OAuthConfig {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    authUrl: string;
    tokenUrl: string;
    userInfoUrl: string; 
    provider: string;    
}

export interface SAMLConfig {
    entryPoint: string;
    issuer: string;
    cert: string;
    callbackUrl: string;
}

export interface Config {
    oauth: OAuthConfig;
    saml: SAMLConfig;
}
