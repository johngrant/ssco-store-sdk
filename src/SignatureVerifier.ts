import * as crypto from 'crypto';

export class SignatureVerifier {
    private secret: string;

    constructor(secret: string = process.env.SIGNATURE_SECRET || 'default-secret') {
        this.secret = secret;
    }

    isValidSignature(payload: string, signature: string): boolean {
        const hmac = crypto.createHmac('sha256', this.secret);
        hmac.update(payload, 'utf8');
        const digest = hmac.digest('hex');
        return digest === signature;
    }
}

export default SignatureVerifier;

// Usage example:
// const verifier = new SignatureVerifier(); // Uses process.env.SIGNATURE_SECRET or 'default-secret'
// const isValid = verifier.isValidSignature(requestBody, receivedSignature);
// const isValid = verifier.isValidSignature(requestBody, receivedSignature);