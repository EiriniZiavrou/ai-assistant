import './App.css';
import { useEffect, useState } from 'react';
import TopMenu from './components/TopMenu';
import ConversationsMenu from './components/ConversationsMenu';
import MessagesView from './components/MessagesView';
import { OpenAIService } from './services/OpenaiService';
import { CONFIG } from './services/config';

const initialConversations = [
  { id: 1, name: 'General Chat', messages: [{ id: 1, text: 'Hello!', role: 'user' }, { id: 2, text: 'Hi there! How can I help you?', role: 'developer' }] },
  { id: 2, name: 'Weather Discussion', messages: [{ id: 1, text: 'What is the weather like?', role: 'user' }, { id: 2, text: 'It is sunny today!', role: 'developer' }] },
  { id: 3, name: 'Jokes & Fun', messages: [{ id: 1, text: 'Tell me a joke', role: 'user' }, { id: 2, text: 'Why did the chicken cross the road? To get to the other side!', role: 'developer' }] },
];

let convCounter = initialConversations.length;


function App() {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [conversations, setConversations] = useState(initialConversations);
  const selectedConversation = conversations[selectedConversationIndex] || { id: -1, name: 'Select a Conversation', messages: null };
  const [shouldRespond, setShouldRespond] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [model, setModel] = useState(CONFIG.DEFAULT_MODEL);

  function handleModelChange(newModel) {
    setModel(newModel);
  }

  function handleConversationSelect(conversation) {
    const conversationIndex = conversations.findIndex(conv => conv.id === conversation.id);
    setSelectedConversationIndex(conversationIndex);
  }

  function handleConversationCreate() {
    const newConversation = { id: ++convCounter, name: `Conversation ${convCounter}`, messages: [] };
    setConversations([...conversations, newConversation]);
    setSelectedConversationIndex(conversations.length);
  }

  function onConversationDelete(conversationId) {
    console.log('Deleting conversation with ID:', conversationId);
    setConversations(prevConversations => prevConversations.filter(conv => conv.id !== conversationId));
    if (selectedConversationIndex !== null && selectedConversation.id === conversationId) {
      setSelectedConversationIndex(null);
    }
    console.log(conversations);
  }

  async function handleSendMessage(message) {
    const newMessage = {
      id: selectedConversation.messages.length + 1,
      text: message,
      role: 'user'
    };

    if (selectedConversation.messages.length === 0) {
      const titleRequest = [{ id: 0, content: message, role: 'user' }, { id: 1, content: "Suggest a short, descriptive title for this conversation.", role: "user" }];
      setShouldRespond(true);
      selectedConversation.name = '';
      await OpenAIService.sendMessage(titleRequest, model,
        (chunk) => {
          selectedConversation.name += chunk.replace(/"/g, ""); // replace(/^"(.*)"$/, '$1');
        }
      );
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
      await OpenAIService.sendMessage(
        selectedConversation.messages.map(
        msg => ({ content: msg.text, role: msg.role })),
        model,
        (chunk) => {
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === selectedConversation.id
                ? {
                  ...conv,
                  messages: (() => {
                    // If last message is developer, append chunk
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    if (lastMsg && lastMsg.role === 'developer') {
                      return conv.messages.map((msg, idx) =>
                        idx === conv.messages.length - 1
                          ? { ...msg, text: msg.text + (chunk || "") }
                          : msg
                      );
                    } else {
                      // If no developer message, create one
                      return [...conv.messages, { id: conv.messages.length + 1, text: chunk || "", role: 'developer' }];
                    }
                  })()
                }
                : conv
            )
          );
        }
      );

      // const assistantMessage = {
      //   id: selectedConversation.messages.length + 1,
      //   text: aiResponse,
      //   role: 'developer'
      // };

      // setConversations(prevConversations =>
      //   prevConversations.map(conv =>
      //     conv.id === selectedConversation.id
      //       ? { ...conv, messages: [...conv.messages, assistantMessage] }
      //       : conv
      //   )
      // );

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        role: 'developer'
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
          hasConversation={!!selectedConversation}
          onModelChange={(newModel) => { handleModelChange(newModel); }}
        >
        </MessagesView>
      </div>
    </div>
  );
}

export default App;
