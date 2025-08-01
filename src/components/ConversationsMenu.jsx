import './ConversationsMenu.css';

export default function ConversationsMenu({ conversations, onConversationSelect, selectedConversationId, onConversationCreate, onConversationDelete }) {

    function handleDeleteClick(e, conversationId) {
        e.stopPropagation();
        if (onConversationDelete) {
            onConversationDelete(conversationId);
        }
    }
    
    return (
        <div className='conversations-menu'>
            <button className='new-conversation-button' title={"Start a New Conversation"} onClick={onConversationCreate}>
                New Conversation
            </button>
            <ul className='conversation-list'>
                {conversations.map((conversation) => (
                    <li
                        key={conversation.id}
                        className={`conversation-item ${selectedConversationId === conversation.id ? 'selected' : ''}`}
                        onClick={() => onConversationSelect(conversation)}
                    >
                        <div className='conversation-content'>
                            <div className='conversation-name'>{conversation.name}</div>
                            <div className='message-count'>({conversation.messages.length-1} messages)</div>
                        </div>
                        <button
                            className='delete-button'
                            onClick={(e) => handleDeleteClick(e, conversation.id)}
                            title="Delete conversation"
                        >
                            <img
                                className='delete-icon'
                                alt="Delete"
                                src="/images/delete.svg"
                            />
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
}