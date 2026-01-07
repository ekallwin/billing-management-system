import React from 'react';

const Footer = () => {
    return (
        <div className="footer">
            &copy; {new Date().getFullYear()} Developed by <a href="https://portfolio-ekallwin.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Allwin E K</a>
        </div>
    );
};

export default Footer;
