import './MessageInput.css';
import { useState } from 'react';

export default function MessageInput({ onSendMessage, onModelChange, disabled = false }) {
    const [message, setMessage] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (message.trim() && !disabled && onSendMessage) {
            onSendMessage(message.trim());
            setMessage('');
        }
    }

    function handleChange(e) {
        const newModel = e.target.value;
        if (onModelChange) {
            onModelChange(newModel);
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
                <select onChange={handleChange}>
                    <option id="gpt-3.5-turbo" value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option id="gpt-4" value="gpt-4">gpt-4</option>
                    <option id="gpt-4-turbo" value="gpt-4-turbo">gpt-4-turbo</option>
                </select>
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