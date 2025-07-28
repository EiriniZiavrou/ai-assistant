import express from 'express';
import { JSONFilePreset } from 'lowdb/node';
import cors from 'cors';

const PORT = 3001;
const server = express();

server.use(cors());

// const conversations = [{ id: 1, name: 'General Chat', messages: [{ id: 1, text: 'Hello!', role: 'user' }, { id: 2, text: 'Hi there! How can I help you?', role: 'developer' }] },
// { id: 2, name: 'Weather Discussion', messages: [{ id: 1, text: 'What is the weather like?', role: 'user' }, { id: 2, text: 'It is sunny today!', role: 'developer' }] },
// { id: 3, name: 'Jokes & Fun', messages: [{ id: 1, text: 'Tell me a joke', role: 'user' }, { id: 2, text: 'Why did the chicken cross the road? To get to the other side!', role: 'developer' }] },
// ];

const db = await JSONFilePreset('./db.json', { conversations: [] });
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
    newConversation.name = `Conversation ${newConversation.id}`;
    newConversation.messages = [];
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