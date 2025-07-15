import './MessageInput.css';
import { useState } from 'react';

export default function MessageInput({ onSendMessage, disabled = false }) {
    const [message, setMessage] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (message.trim() && !disabled && onSendMessage) {
            onSendMessage(message.trim());
            setMessage('');
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <div className="input-container">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={disabled ? "Select a conversation to start chatting..." : "Type your message..."}
                    disabled={disabled}
                    rows={1}
                    className="message-textarea"
                />
                <button 
                    type="submit" 
                    disabled={!message.trim() || disabled}
                    className="send-button"
                >
                    Send
                </button>
            </div>
        </form>
    );
}