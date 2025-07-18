import './MessagesView.css';
import MessageInput from './MessageInput';
import { useState } from 'react';

export default function MessagesView({ messages, onSendMessage, hasConversation }) {

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
                <MessageInput disabled={true} />
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
                                <span
                                    className="message-text"
                                    onClick={() => handleCopyText(message.text, message.id)}
                                    title={copiedMessageId === message.id ? "Copied to clipboard" : "Click to copy"}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {message.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MessageInput onSendMessage={onSendMessage} disabled={!hasConversation} />
        </div>
    );
}