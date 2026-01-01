import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "signalist",
    ai: { gemini: { api_key: process.env.GEMINI_API_KEY } }
});