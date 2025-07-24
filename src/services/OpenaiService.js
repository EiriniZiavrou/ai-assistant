import { CONFIG } from './config';
//test
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: CONFIG.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});
// End of test

export class OpenAIService {
    static async sendMessage(conversationHistory, model = CONFIG.DEFAULT_MODEL, onStreamChunk) {
        try {
            console.log('Conversation history:', conversationHistory);

            //test
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

            console.log('Model used: ', model);
            // End of test

            // const response = await fetch(CONFIG.OPENAI_API_URL, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            //     },
            //     body: JSON.stringify({
            //         model: model,
            //         messages: conversationHistory,
            //         // max_tokens: 4096
            //         max_completion_tokens: 4096
            //     }),
            //     stream: true
            // });

            // if (!response.ok) {
            //     throw new Error(`OpenAI API error: ${response.status}`);
            // }

            // const data = await response.json();
            //console.log('Model used: ', data.model);
            // return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            throw new Error('Failed to get AI response. Please try again.');
        }
    }
}