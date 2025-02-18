export interface WebhookEvent<T = unknown> {
    type: string;
    data: T;
}

export interface OrderCreatedEvent extends WebhookEvent<OrderCreatedData> {
    type: 'order_created';
}

export interface OrderUpdatedEvent extends WebhookEvent<OrderUpdatedData> {
    type: 'order_updated';
}

// Define the structure of the data field for each event type
export interface OrderCreatedData {
    id: string;
    customer_id: string;
    product_id: string;
    amount: number;
    currency: string;
    created_at: string;
    // Add other relevant fields for the order_created event
}

export interface OrderUpdatedData {
    id: string;
    status: string;
    updated_at: string;
    // Add other relevant fields for the order_updated event
}

// Add more interfaces for other event types as needed