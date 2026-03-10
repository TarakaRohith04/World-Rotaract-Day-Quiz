import React from 'react';

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p>For any queries, please contact Admin:</p>
                <div className="contact-details">
                    <a href="tel:+91 8919776649" className="contact-link">+91 8919776649</a>
                    <span className="separator">|</span>
                    <a href="mailto:rotaractclubofeliteleague@gmail.com" className="contact-link">rotaractclubofeliteleague@gmail.com</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
