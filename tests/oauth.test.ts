import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { initOAuth, authenticate } from '../src/oauth';
import axios from 'axios';
import { AppDataSource } from '../src/database/data-source';
import { User } from '../src/database/entities/User';

describe('OAuth Service', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return 400 if no authorization code is provided', async () => {
        const req = { body: {} } as Request;
        const res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
        } as Partial<Response>;

        initOAuth({} as any, {
            authUrl: process.env.OAUTH_AUTH_URL!,
            tokenUrl: process.env.OAUTH_TOKEN_URL!,
            clientId: process.env.OAUTH_CLIENT_ID!,
            clientSecret: process.env.OAUTH_CLIENT_SECRET!,
            callbackUrl: process.env.OAUTH_CALLBACK_URL!,
            userInfoUrl: process.env.OAUTH_USER_INFO_URL!,
            provider: process.env.OAUTH_PROVIDER!,
        });

        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should authenticate user and return a token', async () => {
        sandbox.stub(axios, 'post').resolves({ data: { access_token: 'test_token' } });
        sandbox.stub(axios, 'get').resolves({ data: { id: '123', name: 'Test User', email: 'test@example.com', picture: 'avatar_url' } });

        const userRepositoryStub = sandbox.stub(AppDataSource.getRepository(User));
        userRepositoryStub.findOne.resolves(null);
        userRepositoryStub.save.resolves({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            provider: 'oauth_provider',
            providerId: '123',
            avatar: 'avatar_url'
        } as User);        
        const req = { body: { code: 'test_code' } } as Request;
        const res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
        } as Partial<Response>;

        initOAuth({} as any, {
            authUrl: process.env.OAUTH_AUTH_URL!,
            tokenUrl: process.env.OAUTH_TOKEN_URL!,
            clientId: process.env.OAUTH_CLIENT_ID!,
            clientSecret: process.env.OAUTH_CLIENT_SECRET!,
            callbackUrl: process.env.OAUTH_CALLBACK_URL!,
            userInfoUrl: process.env.OAUTH_USER_INFO_URL!,
            provider: process.env.OAUTH_PROVIDER!,
        });

        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    });

    it('should return 401 for an invalid token', () => {
        const req = { headers: { authorization: 'Bearer invalid_token' } } as Request;
        const res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
        } as Partial<Response>;
        const next = sandbox.stub() as unknown as NextFunction;

        authenticate(req, res as Response, next);

        sinon.assert.calledWith(res.status as sinon.SinonStub, 401);
        sinon.assert.calledWith(res.json as sinon.SinonStub, { error: 'Invalid token' });
    });

    it('should attach user data to request for a valid token', () => {
        const fakeToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET || 'test_secret');
        const req = { headers: { authorization: `Bearer ${fakeToken}` } } as Request & { user?: any };
        const res = {} as Response;
        const next = sandbox.stub() as unknown as NextFunction;

        authenticate(req, res, next);

        expect(req.user?.id).to.equal('user123');
        sinon.assert.calledOnce(next as sinon.SinonStub);
    });
});