import Switch from './Switch';
import './TopMenu.css';

export default function TopMenu({ title = 'Conversation', onMenuToggle }) {

    return (
        <div className="top-menu">
            <button onClick={onMenuToggle}>
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
            <Switch ></Switch>
        </div>
    );
}