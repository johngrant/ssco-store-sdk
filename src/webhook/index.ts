import { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from 'express';
import { WebhookEvent, OrderCreatedEvent, OrderUpdatedEvent } from './types';

// Generalized webhook handler for Lemon Squeezy
export const webhookHandler = (req: Request | NextApiRequest, res: Response | NextApiResponse) => {
    const event: WebhookEvent = req.body;

    // TOOD.JMG: Verify webhook body.
    //

    
    // Verify the webhook signature (optional, recommended)
    // const signature = req.headers['x-signature'] as string;
    // if (!verifySignature(event, signature)) {
    //     return res.status(400).send('Invalid signature');
    // }

    // Handle the webhook event
    switch (event.type) {
        // Add more cases for other event types as needed
        default:
            // TODO.JMG: Insert record into db for processing later 
            //
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond to the webhook
    res.status(200).send('Webhook received');
};


// Function to verify the webhook signature (optional, recommended)
// function verifySignature(event: WebhookEvent, signature: string): boolean {
//     // Implement your signature verification logic here
//     return true;
// }