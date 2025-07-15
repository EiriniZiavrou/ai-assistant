import './TopMenu.css';

export default function TopMenu({ title = 'Conversation' }) {
    return (
        <div className="top-menu">
            <button onClick={() => { console.log('Conversations button clicked'); }} >
                <img
                    className="menu-button"
                    alt="Conversations"
                    src="/images/conversations.svg"
                />
            </button>
            <div className='logo-and-title'>
                <button
                    onClick={() => window.open("https://www.softbiz.eu/index-eng.html", "_blank")}
                >
                    <img
                        className="logo-button"
                        alt="Softbiz logo"
                        src="/images/softbizlogo.svg"
                    />
                </button>
                {title}
            </div>
            <button
                className="user-profile-button"
                onClick={() => console.log('User profile button clicked')}
            >
                <img
                    className="user-profile-img"
                    alt="User profile"
                    src="/images/user-profile.svg"
                />
            </button>
        </div>
    );
}