import { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from 'express';
import { WebhookEvent, OrderCreatedEvent, OrderUpdatedEvent } from './types';

// Generalized webhook handler for Lemon Squeezy
export const webhookHandler = (req: Request | NextApiRequest, res: Response | NextApiResponse) => {
    const event: WebhookEvent = req.body;

    // Verify the webhook signature (optional, recommended)
    // const signature = req.headers['x-signature'] as string;
    // if (!verifySignature(event, signature)) {
    //     return res.status(400).send('Invalid signature');
    // }

    // Handle the webhook event
    switch (event.type) {
        case 'order_created':
            handleOrderCreated(event as OrderCreatedEvent);
            break;
        case 'order_updated':
            handleOrderUpdated(event as OrderUpdatedEvent);
            break;
        // Add more cases for other event types as needed
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond to the webhook
    res.status(200).send('Webhook received');
};

// Function to handle 'order_created' event
function handleOrderCreated(event: OrderCreatedEvent) {
    console.log('Order created:', event);
    // Add your logic to handle the order_created event
}

// Function to handle 'order_updated' event
function handleOrderUpdated(event: OrderUpdatedEvent) {
    console.log('Order updated:', event);
    // Add your logic to handle the order_updated event
}

// Function to verify the webhook signature (optional, recommended)
// function verifySignature(event: WebhookEvent, signature: string): boolean {
//     // Implement your signature verification logic here
//     return true;
// }