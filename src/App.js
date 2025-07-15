import './App.css';
import { useEffect, useState } from 'react';
import TopMenu from './components/TopMenu';
import ConversationsMenu from './components/ConversationsMenu';
import MessagesView from './components/MessagesView';
import { OpenAIService } from './services/OpenaiService';

const initialConversations = [
  { id: 1, name: 'General Chat', messages: [{ id: 1, text: 'Hello!', role: 'user' }, { id: 2, text: 'Hi there! How can I help you?', role: 'assistant' }] },
  { id: 2, name: 'Weather Discussion', messages: [{ id: 1, text: 'What is the weather like?', role: 'user' }, { id: 2, text: 'It is sunny today!', role: 'assistant' }] },
  { id: 3, name: 'Jokes & Fun', messages: [{ id: 1, text: 'Tell me a joke', role: 'user' }, { id: 2, text: 'Why did the chicken cross the road? To get to the other side!', role: 'assistant' }] },
];


function App() {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [conversations, setConversations] = useState(initialConversations);
  const selectedConversation = conversations[selectedConversationIndex] || { id: -1, name: 'Select a Conversation', messages: null };
  const [shouldRespond, setShouldRespond] = useState(false);

  function handleConversationSelect(conversation) {
    const conversationIndex = conversations.findIndex(conv => conv.id === conversation.id);
    setSelectedConversationIndex(conversationIndex);
  }

  function handleConversationCreate() {
    const newConversation = { id: conversations.length + 1, name: `Conversation ${conversations.length + 1}`, messages: [] };
    setConversations([...conversations, newConversation]);
    setSelectedConversationIndex(conversations.length);
  }

  async function handleSendMessage(message) {
    const newMessage = {
      id: selectedConversation.messages.length + 1,
      text: message,
      role: 'user'
    };

    if (selectedConversation.messages.length === 0) {
      const title = [{id:selectedConversation.messages.length + 1, content: message, role:'user'}, { id: 0, content: "Suggest a short, descriptive title for this conversation.", role: "user" }];
      setShouldRespond(true);
      const aiTitleResponse = await OpenAIService.sendMessage(title);
      selectedConversation.name = aiTitleResponse.replace(/^"(.*)"$/, '$1');
    }

    setShouldRespond(true);
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );
  }

  useEffect(() => {
    if (shouldRespond) {
      setShouldRespond(false);
      handleResponse();
    }
  }, [conversations]);

  async function handleResponse() {
    try {
      const aiResponse = await OpenAIService.sendMessage(
        selectedConversation.messages.map(msg => ({ content: msg.text, role: msg.role }))
      );

      const assistantMessage = {
        id: selectedConversation.messages.length + 1,
        text: aiResponse,
        role: 'assistant'
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      );

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        role: 'assistant'
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      );
    }
  }

  return (
    <div className="App">
      <TopMenu title={selectedConversation.name}></TopMenu>
      <div className="main-content">
        <ConversationsMenu onConversationSelect={handleConversationSelect} conversations={conversations} selectedConversationId={selectedConversation.id} onConversationCreate={handleConversationCreate}></ConversationsMenu>
        <MessagesView messages={selectedConversation.messages} onSendMessage={handleSendMessage} hasConversation={!!selectedConversation}></MessagesView>
      </div>
    </div>
  );
}

export default App;
