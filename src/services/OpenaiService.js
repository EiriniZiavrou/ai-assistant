import { CONFIG } from './config';

export class OpenAIService {
    static async sendMessage(conversationHistory, model = CONFIG.DEFAULT_MODEL) {
        try {
            console.log('Conversation history:', conversationHistory);

            const response = await fetch(CONFIG.OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: conversationHistory,
                    max_tokens: 4096
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Model used: ', data.model);
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            throw new Error('Failed to get AI response. Please try again.');
        }
    }
}