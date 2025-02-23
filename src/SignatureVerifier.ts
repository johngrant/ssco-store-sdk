import * as crypto from 'crypto';
import { Logger } from './Logger';

export class SignatureVerifier {
    private secret: string;

    constructor(secret: string = process.env.SIGNATURE_SECRET || 'default-secret') {
        this.secret = secret;
    }

    isValidSignature(payload: string, signature: string): boolean {
        Logger.info('Executing isValidSignature().');
        const hmac = crypto.createHmac('sha256', this.secret);
        hmac.update(payload, 'utf8');
        const digest = hmac.digest('hex');
        Logger.info('Executed isValidSignature().');
        const isValid = digest === signature;
        Logger.info({ isValid });
        return isValid;
    }
}

// Usage example:
// const verifier = new SignatureVerifier(); // Uses process.env.SIGNATURE_SECRET or 'default-secret'
// const isValid = verifier.isValidSignature(requestBody, receivedSignature);
// const isValid = verifier.isValidSignature(requestBody, receivedSignature);