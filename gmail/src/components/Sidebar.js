// import React from 'react';
// import './Sidebar.css';
// import { FiEdit2, FiInbox, FiStar, FiSend, FiUsers, FiFile, FiTrash2, FiMail } from 'react-icons/fi';

// const Sidebar = () => {
//   return (
//     <aside className="sidebar">
//       <button className="sidebar__composeBtn">
//         <FiEdit2 className="sidebar__composeIcon" /> Compose</button>
//       <ul className="sidebar__menu">
//         <li><FiInbox /> Inbox</li>
//         <li><FiStar /> Starred</li>
//         <li><FiSend /> Sent</li>
//         <li><FiUsers /> Groups</li>
//         <li><FiFile /> Drafts</li>
//         <li><FiTrash2 /> Bin</li>
//         <li><FiMail /> All Mail</li>
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import './Sidebar.css';
import { FiEdit2, FiInbox, FiStar, FiSend, FiUsers, FiFile, FiTrash2, FiMail } from 'react-icons/fi';
import ComposeMail from './ComposeMail';

const Sidebar = ({ isDarkTheme }) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <>
      <aside className={`sidebar ${isDarkTheme ? 'dark' : ''}`}>
        <button className="sidebar__composeBtn" onClick={() => setIsComposeOpen(true)}>
          <FiEdit2 className="sidebar__composeIcon" /> Compose
        </button>
        <ul className="sidebar__menu">
          <li><FiInbox /> Inbox</li>
          <li><FiStar /> Starred</li>
          <li><FiSend /> Sent</li>
          <li><FiUsers /> Groups</li>
          <li><FiFile /> Drafts</li>
          <li><FiTrash2 /> Bin</li>
          <li><FiMail /> All Mail</li>
        </ul>
      </aside>

      {isComposeOpen && (
        <ComposeMail open={isComposeOpen} setOpenDrawer={setIsComposeOpen} isDarkTheme={isDarkTheme} />
      )}
    </>
  );
};

export default Sidebar;