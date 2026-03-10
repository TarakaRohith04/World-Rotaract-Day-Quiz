import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="app-header">
            <Link to="/" className="logo">
                Project అభ్యాసం
            </Link>
            <div className="header-club">
                <span>Initiative by Rotaract Club of Vijayawada Elite League</span>
                <img src="/Vijayawada_Elite_League.png" alt="Club Logo" className="club-logo-img" />
            </div>
        </header>
    );
}

export default Header;
