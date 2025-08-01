import express from 'express';
import { JSONFilePreset } from 'lowdb/node';
import cors from 'cors';
import { SITE_CONFIGS } from './siteConfigs.js';

const PORT = 3001;
const server = express();

server.use(cors());

const siteURL = "www.skroutz.gr";
const { name, details, category, goal, endgoal, questions } = SITE_CONFIGS[siteURL];
const db = await JSONFilePreset(`./db_${name}.json`, { conversations: [] });
const { conversations } = db.data;

let id = conversations.length + 1;

server.use(express.json());

// This is a GET endpoint to retrieve conversations, it can filter by ID if provided.
server.get('/conversations', (req, res) => {
    if (req.query.id) {
        const conversation = conversations.find(conv => conv.id === parseInt(req.query.id));
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        return res.json(conversation);
    }
    res.json(conversations);
});

// This is a GET endpoint to retrieve messages of a specific conversation by ID.
// It returns a 404 error if the conversation is not found.
server.get('/conversations/messages', (req, res) => {
    if (req.query.id) {
        const conversation = conversations.find(conv => conv.id === parseInt(req.query.id));
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        return res.json(conversation.messages);
    }
    res.status(400).json({ error: 'Conversation ID is required' });
});

// This is a PUT endpoint to add a new message to a conversation.
// It checks if the conversation exists and adds the message to its messages array.
server.put('/conversations/messages', async (req, res) => {
    await db.update(({ conversations }) => {
        if (!req.query.id) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }
        const conv = conversations.find(c => c.id === parseInt(req.query.id));
        if (conv) {
            conv.messages.push({
                id: conv.messages.length + 1,
                text: req.body.text,
                role: req.body.role
            });
            res.status(201).json(conv);
        }
        else {
            res.status(404).json({ error: 'Conversation not found' });
        }
    });
});

// This is a POST endpoint to create a new conversation, it initializes the conversation
// with an empty messages array and assigns a unique ID.
server.post('/conversations', async (req, res) => {
    const newConversation = {};
    newConversation.id = id++;
    newConversation.name = `Feedback Conversation`;
    newConversation.messages = [{
        id: 1,
        // text: `Details: ${details}. Goal: ${goal}. Endgoal: ${endgoal}. Make sure you cover these topics: ${questions}. If user is not fully satisfied, ask them to elaborate on their feedback.`,
        text: `Details: ${details}. Goal: ${goal}. Endgoal: ${endgoal}. If user is not fully satisfied, ask them to elaborate on their feedback.`,
        role: 'developer'
    },
    {
        id: 2,
        text: `Hello! Thank you for attending our ${category}. On a scale of 1-5, how would you rate your overall experience?`,
        role: 'assistant'
    }
    ];
    await db.update(({ conversations }) => conversations.push(newConversation));
    res.status(201).json(newConversation);
});

// This is a PUT endpoint to update the name of an existing conversation by its ID.
server.put('/conversations', async (req, res) => {
    const conversationId = parseInt(req.query.id);
    if (!conversationId) {
        return res.status(400).json({ error: 'Conversation ID is required' });
    }
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }
    conversation.name = req.body.name;
    await db.write();
    res.json(conversation);
});

// This is a DELETE endpoint to remove a conversation by its ID.
server.delete('/conversations', async (req, res) => {
    const conversationId = parseInt(req.query.id);
    if (!conversationId) {
        return res.status(400).json({ error: 'Conversation ID is required' });
    }
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }
    conversations.splice(conversations.indexOf(conversation), 1);
    await db.write();
    res.status(204).send();
});

server.listen(PORT, () => {
    console.log(`Conversations server running on http://localhost:${PORT}`);
});