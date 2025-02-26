export interface WebhookEventRequest {
  meta: MetaData;
  data: Data;
}

export interface MetaData {
  event_name: string;
}

export interface Data {
  type: string;
}

export interface WebhookEventCreate {
  event_name: string;
  event_type: string;
  payload: string;
}
