import { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from 'express';
import { WebhookEventRequest } from './shared.types';
import { insertWebhookEvent } from './db';

// Generalized webhook handler for Lemon Squeezy
export const webhookHandler = async (req: Request | NextApiRequest, res: Response | NextApiResponse) => {
    const event: WebhookEventRequest = req.body;

    // TOOD.JMG: Verify webhook body.
    //


    // Verify the webhook signature (optional, recommended)
    // const signature = req.headers['x-signature'] as string;
    // if (!verifySignature(event, signature)) {
    //     return res.status(400).send('Invalid signature');
    // }

    // Handle the webhook event
 
    // Respond to the webhook
    console.log(event);
    await insertWebhookEvent({event_name: event.meta.event_name, event_type: event.type, payload: JSON.stringify(event)})
    res.status(200).send('Webhook received');
};


// Function to verify the webhook signature (optional, recommended)
// function verifySignature(event: WebhookEvent, signature: string): boolean {
//     // Implement your signature verification logic here
//     return true;
// }