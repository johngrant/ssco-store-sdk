import {insertWebhookEvent } from './db';

describe('database', () => {
    test('db should not be null', () => {
        expect(insertWebhookEvent).not.toBeNull();
    });
});