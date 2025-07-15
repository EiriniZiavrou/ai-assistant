export const CONFIG = {
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  DEFAULT_MODEL: 'gpt-3.5-turbo'
};

if (!CONFIG.OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Please set REACT_APP_OPENAI_API_KEY in your .env file');
}