import { CONFIG } from './config.js';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: CONFIG.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export class OpenAIService {
    static async sendMessage(conversationHistory, model = CONFIG.DEFAULT_MODEL, onStreamChunk) {
        try {
            console.log('Conversation history:', conversationHistory);

            const completion = await openai.chat.completions.create({
                model: model,
                messages: conversationHistory,
                stream: true,
            });

            for await (const chunk of completion) {
                if (chunk.choices[0].finish_reason === 'stop') break;
                const content = chunk.choices[0].delta.content;
                if (onStreamChunk) onStreamChunk(content); // Send chunk to App.js
            }
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            throw new Error('Failed to get AI response. Please try again.');
        }
    }
}