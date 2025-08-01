import './MessagesView.css';
import MessageInput from './MessageInput';
import { useState } from 'react';
import { MarkdownMessage } from './MarkdownMessage.tsx';

export default function MessagesView({ messages, onSendMessage, hasConversation, onModelChange, onConversationEnd }) {

    const [copiedMessageId, setCopiedMessageId] = useState(null);

    const handleCopyText = (text, messageId) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        });
    };

    if (!messages) {
        return (
            <div className="messages-view">
                <div className="no-messages">Select a conversation to view messages</div>
                <MessageInput onModelChange={onModelChange} disabled={true} />
            </div>
        );
    }

    return (
        <div className="messages-view">
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">No messages in this conversation</div>
                ) : (
                    <ul className="message-list">
                        {messages.map((message) => (
                            <li key={message.id} className={`message-item ${message.role} ${copiedMessageId === message.id ? 'copied' : ''}`}>
                                <div className="message-header">
                                    <div
                                        className="message-text"
                                    >
                                        <MarkdownMessage content={message.text} />
                                    </div>
                                    <button
                                        className="copy-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyText(message.text, message.id);
                                        }}
                                    >
                                        <img src="./images/copy-icon.svg" alt="Copy" className="copy-icon" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

            </div>
            <div className="button-container relative">
                <button className="end-conversation" onClick={onConversationEnd}>
                    End Conversation
                </button>
            </div>
            <MessageInput onSendMessage={onSendMessage} disabled={!hasConversation} onModelChange={onModelChange} />
        </div>
    );
}