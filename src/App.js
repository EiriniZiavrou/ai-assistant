import './App.css';
import { useEffect, useState } from 'react';
import TopMenu from './components/TopMenu.jsx';
import ConversationsMenu from './components/ConversationsMenu.jsx';
import MessagesView from './components/MessagesView.jsx';
import { OpenAIService } from './services/OpenaiService.js';
import { CONFIG } from './services/config.js';

function App() {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [conversations, setConversations] = useState([]);
  const selectedConversation = conversations[selectedConversationIndex] || { id: -1, name: 'Select a Conversation', messages: null };
  const [shouldRespond, setShouldRespond] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [model, setModel] = useState(CONFIG.DEFAULT_MODEL);

  useEffect(() => {
    fetch('http://localhost:3001/conversations', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(err => console.error('Failed to fetch conversations:', err));
  }, []);

  function handleModelChange(newModel) {
    setModel(newModel);
  }

  function handleConversationSelect(conversation) {
    const conversationIndex = conversations.findIndex(conv => conv.id === conversation.id);
    setSelectedConversationIndex(conversationIndex);
  }

  function handleConversationCreate() {
    fetch('http://localhost:3001/conversations', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(newConversation => {
        setConversations(prev => [...prev, newConversation]);
      })
      .catch(err => console.error('Failed to fetch conversations:', err));
    setSelectedConversationIndex(conversations.length);

  }

  function onConversationDelete(conversationId) {
    console.log('Deleting conversation with ID:', conversationId);
    fetch(`http://localhost:3001/conversations?id=${conversationId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          console.log('Conversation deleted successfully');
          setConversations(prevConversations => prevConversations.filter(conv => conv.id !== conversationId));
          if (selectedConversationIndex !== null && selectedConversation.id === conversationId) {
            setSelectedConversationIndex(null);
          }
        } else {
          console.error('Failed to delete conversation');
        }
      })
      .catch(err => console.error('Error deleting conversation:', err));
  }

  async function handleConversationEnd() {
    console.log('Ending conversation');

    const summary = "Summarize this conversation, highlighting what the user liked and what they didn’t like. Be concise and clear.";

    if (selectedConversation.id !== -1) {
      try {
        handleSendMessage(summary);
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  async function handleSendMessage(message) {
    const newMessage = {
      id: selectedConversation.messages.length + 1,
      text: message,
      role: 'user'
    };

    fetch(`http://localhost:3001/conversations/messages?id=${selectedConversation.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message, role: 'user' })
    }).then(() => setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      ))
    ).then(() => { setShouldRespond(true); });

    if (selectedConversation.messages.length === 0) {
      const titleRequest = [{ id: 0, content: message, role: 'user' }, { id: 1, content: "Suggest a short, descriptive title for this conversation.", role: "user" }];
      setShouldRespond(true);
      selectedConversation.name = '';
      await OpenAIService.sendMessage(titleRequest, model,
        (chunk) => {
          selectedConversation.name += chunk.replace(/"/g, "");
        }
      );
    }
  }

  useEffect(() => {
    if (shouldRespond) {
      setShouldRespond(false);
      handleResponse();
    }
  }, [conversations]);

  async function handleResponse() {
    let messageToAppend = "";

    try {
      await OpenAIService.sendMessage(
        selectedConversation.messages.map(msg => ({ content: msg.text, role: msg.role })),
        model,
        (chunk) => {
          messageToAppend += chunk;
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === selectedConversation.id
                ? {
                  ...conv,
                  messages: (() => {
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      return conv.messages.map((msg, idx) =>
                        idx === conv.messages.length - 1
                          ? { ...msg, text: msg.text + (chunk || "") }
                          : msg
                      );
                    } else {
                      return [...conv.messages, { id: conv.messages.length + 1, text: chunk || "", role: 'assistant' }];
                    }
                  })()
                }
                : conv
            )
          );
        }
      );
      await fetch(`http://localhost:3001/conversations/messages?id=${selectedConversation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageToAppend, role: 'assistant' })
      });

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

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className="App">
      <TopMenu title={selectedConversation.name} onMenuToggle={toggleMenu}></TopMenu>
      <div className="main-content">
        {isMenuOpen && (
          <ConversationsMenu
            onConversationSelect={handleConversationSelect}
            conversations={conversations}
            selectedConversationId={selectedConversation.id}
            onConversationCreate={handleConversationCreate}
            onConversationDelete={onConversationDelete}>
          </ConversationsMenu>
        )}
        <MessagesView
          messages={selectedConversation.messages}
          onSendMessage={handleSendMessage}
          onConversationEnd={handleConversationEnd}
          hasConversation={!!selectedConversation}
          onModelChange={(newModel) => { handleModelChange(newModel); }}
        >
        </MessagesView>
      </div>
    </div>
  );
}

export default App;
