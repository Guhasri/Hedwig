// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { FiEdit2, FiInbox, FiStar, FiSend, FiUsers, FiFile, FiTrash2, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ComposeMail from './ComposeMail';

const Sidebar = ({ isDarkTheme }) => {
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.user && user.user.emailId) {
            setLoggedInUserEmail(user.user.emailId);
        } 
    }, []);

    const handleInboxClick = () => {
        navigate('/app'); // Navigate to MainContent
    };

    const handleDraftsClick = () => {
        navigate('/drafts'); // Navigate to DraftsList
    };

    const handleStarredClick = () => {
        navigate('/starred'); // Navigate to Starred Emails
    };

    const handleBinClick = () => {
        navigate('/bin'); // Navigate to Bin Emails
    };

    const handleAllMailsClick = () => {
        navigate('/all-mails'); // Navigate to All Mails
    };

    return (
        <>
            <aside className={`sidebar ${isDarkTheme ? 'dark' : ''}`}>
                <button className="sidebar__composeBtn" onClick={() => setIsComposeOpen(true)}>
                    <FiEdit2 className="sidebar__composeIcon" /> Compose
                </button>
                <ul className="sidebar__menu">
                    <li onClick={handleInboxClick}><FiInbox /> Inbox</li>
                    <li onClick={handleStarredClick}><FiStar /> Starred</li>
                    <li><FiSend /> Sent</li>
                    <li><FiUsers /> Groups</li>
                    <li onClick={handleDraftsClick}><FiFile /> Drafts</li>
                    <li onClick={handleBinClick}><FiTrash2 /> Bin</li>
                    <li onClick={handleAllMailsClick}><FiMail /> All Mail</li> {/* All Mails Button */}
                </ul>
            </aside>

            {isComposeOpen && (
                <ComposeMail open={isComposeOpen} handleClose={() => setIsComposeOpen(false)} isDarkTheme={isDarkTheme} />
            )}
        </>
    );
};

export default Sidebar;
