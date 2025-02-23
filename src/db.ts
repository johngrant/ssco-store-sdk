import { Pool } from "pg";
import { WebhookEventCreate } from "./shared.types";
import { Logger } from "./Logger";

const pool = new Pool({
  user: "your_db_user",
  host: "your_db_host",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432, // default PostgreSQL port
});

const db = {
  query: (text: string, params?: string[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};

const insertWebhookEvent = async (event: WebhookEventCreate) => {
  try {
    Logger.info("Executing insertWebhookEvent().");
    const query =
      "INSERT INTO webhook_events(event_name, event_type, payload) VALUES($1, $2, $3)";
    const values = [
      event.event_name,
      event.event_type,
      JSON.stringify(event.payload),
    ];
    await db.query(query, values);
  } catch (error) {
    Logger.error("Error inserting webhook event.");
    throw error;
  } finally {
    Logger.info("Executed insertWebhookEvent().");
  }
};

export { insertWebhookEvent };
