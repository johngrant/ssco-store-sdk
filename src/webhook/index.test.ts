import { NextApiRequest, NextApiResponse } from 'next';
import { webhookHandler } from './index';

describe('webhookHandler', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let sendMock: jest.Mock;


    beforeEach(() => {
        jsonMock = jest.fn();
        sendMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({
            json: jsonMock,
            send: sendMock
        });
        req = {
            body: {}
        };
        res = {
            status: statusMock,
            json: jsonMock,
            send: sendMock
        };
    });

    it('should send 200 response', async () => {
        req.body = {};
        await webhookHandler(req as NextApiRequest, res as NextApiResponse);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should write webhook event data to database', () => {
            throw new Error('Not implemented');
    })
});