export interface WebhookEventRequest {
    meta: MetaData;
    type: string;
}

export interface MetaData {
    event_name: string
};

export interface WebhookEventCreate {
    event_name: string;
    event_type: string,
    payload: string
};