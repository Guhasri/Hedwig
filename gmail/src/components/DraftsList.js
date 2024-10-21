import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './DraftsList.css';

const DraftsList = () => {
    const [drafts, setDrafts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get('http://localhost:1973/api/drafts', {
                    params: { email: user.email },
                });
                setDrafts(response.data || []);
            } catch (error) {
                console.error('Error fetching drafts:', error);
            }
        };

        fetchDrafts();
    }, []);

    const handleDraftClick = (draft) => {
        // Navigate to the ComposeMail page with the draft data
        console.log('Sending draft data',draft._id);
        navigate('/compose', { state: { draft } });
    };

    return (
        <Box className="drafts-list-container">
            <Typography variant="h5" style={{ fontWeight: "bold", textAlign: "center" }}>Drafts</Typography>
            <ul>
                {drafts.map((draft) => (
                    <li key={draft._id} onClick={() => handleDraftClick(draft)} className="draft-item">
                        <span className="draft-subject">{draft.subject}</span> - <span className="draft-from">{draft.from}</span>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default DraftsList;
