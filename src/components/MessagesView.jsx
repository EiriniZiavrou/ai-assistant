import './MessagesView.css';
import MessageInput from './MessageInput';

export default function MessagesView({ messages, onSendMessage, hasConversation }) {
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
                            <li key={message.id} className={`message-item ${message.role}`}>
                                <span className="message-text">{message.text}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MessageInput onSendMessage={onSendMessage} disabled={!hasConversation} />
        </div>
    );
}