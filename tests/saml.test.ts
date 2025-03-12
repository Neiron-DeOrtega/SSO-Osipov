import { expect } from 'chai';
import sinon from 'sinon';
import passport from 'passport';
import { Express } from 'express';
import { initSAML } from '../src/saml';
const app = require('express')()

describe('SAML Authentication', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should throw an error if required SAML config is missing', () => {
        expect(() => initSAML(app, { callbackUrl: '', entryPoint: '', issuer: '', cert: '' })).to.throw('Missing required SAML configuration');
    });

    it('should configure passport SAML strategy', () => {
        const useStub = sandbox.stub(passport, 'use');

        initSAML(app, { callbackUrl: '/saml/callback', entryPoint: 'https://sso.example.com', issuer: 'test-issuer', cert: 'test-cert' });

        expect(useStub.calledOnce).to.be.true;
    });

});
