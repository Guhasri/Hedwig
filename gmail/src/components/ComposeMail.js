import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, IconButton, InputBase, Paper, Tooltip, Typography, Menu, MenuItem
} from '@mui/material';
import { AttachFile, DeleteOutline, InsertEmoticon, Close } from '@mui/icons-material';
import { EditorState } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css'; 
import Picker from 'emoji-picker-react';
import axios from 'axios'; 
import { stateToHTML } from 'draft-js-export-html';

const groups = [
    { label: 'Group 1', emails: ['user1@example.com', 'user2@example.com'] },
    { label: 'Group 2', emails: ['user3@example.com', 'user4@example.com'] },
];

const ComposeMail = ({ open, handleClose }) => {
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.user && user.user.emailId) {
            setLoggedInUserEmail(user.user.emailId);
        }
    }, []);

    const [data, setData] = useState({ to: '', from: loggedInUserEmail, cc: '', bcc: '', subject: '', body: '' });
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [attachments, setAttachments] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleEditorChange = (state) => {
        setEditorState(state);
        const contentState = state.getCurrentContent();
        const bodyText = stateToHTML(contentState);
        setData(prevData => ({ ...prevData, body: bodyText }));
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newAttachments = Array.from(files).map(file => file.name);
            setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
        }
    };

    const removeAttachment = (fileName) => {
        setAttachments(prevAttachments => prevAttachments.filter(file => file !== fileName)); 
    };

    const onValueChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleEmojiClick = (event, emojiObject) => {
        const contentState = editorState.getCurrentContent();
        const newContent = contentState.createEntity('emoji', 'IMMUTABLE', { emoji: emojiObject.emoji });
        const entityKey = newContent.getLastCreatedEntityKey();
        const newState = EditorState.set(editorState, { currentContent: newContent });
        setEditorState(newState);
    };

    const sendEmail = async () => {
        try {
            const emailData = {
                to: data.to,
                from: loggedInUserEmail,
                cc: data.cc,
                bcc: data.bcc,
                subject: data.subject,
                body: data.body,
                date: new Date(),
                attachments: attachments
            };

            console.log("Attempting to send email with data:", emailData);

            const response = await axios.post('http://localhost:1973/api/send', emailData);

            console.log('Response from server:', response.data);

            resetFields();
            handleClose();
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const resetFields = () => {
        setData({ to: '', cc: '', bcc: '', subject: '', body: '' });
        setEditorState(EditorState.createEmpty());
        setAttachments([]);
    };

    const saveAsDraft = async () => {
        try {
            const draftData = {
                to: data.to,
                from: loggedInUserEmail,
                cc: data.cc,
                bcc: data.bcc,
                subject: data.subject,
                body: data.body,
                attachments: attachments,
            };

            console.log('Attempting to save draft with data:', draftData);

            const response = await axios.post('http://localhost:1973/api/drafts', draftData);

            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    const handleToClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseDropdown = () => {
        setAnchorEl(null);
    };

    const handleGroupSelect = (group) => {
        const emails = group.emails.join(', ');
        setData(prevData => ({ ...prevData, to: prevData.to ? `${prevData.to}, ${emails}` : emails }));
        handleCloseDropdown();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <Box display="flex" flexDirection="column" height="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px" bgcolor="#f2f6fc">
                    <Typography variant="h6">New Message</Typography>
                    <IconButton onClick={() => {
                        handleClose(); 
                        resetFields(); 
                    }}>
                        <Close />
                    </IconButton>
                </Box>

                <Box padding="10px">
                    <InputBase 
                        placeholder="To" 
                        onClick={handleToClick} 
                        name="to" 
                        onChange={onValueChange}  // Enable typing
                        value={data.to} 
                        fullWidth 
                    />
                    <Menu 
                        anchorEl={anchorEl} 
                        open={Boolean(anchorEl)} 
                        onClose={handleCloseDropdown}
                    >
                        {groups.map((group, index) => (
                            <MenuItem key={index} onClick={() => handleGroupSelect(group)}>
                                {group.label}
                            </MenuItem>
                        ))}
                    </Menu>
                    <InputBase placeholder="Cc" name="cc" onChange={onValueChange} value={data.cc || ''} fullWidth />
                    <InputBase placeholder="Bcc" name="bcc" onChange={onValueChange} value={data.bcc || ''} fullWidth />
                    <InputBase placeholder="Subject" name="subject" onChange={onValueChange} value={data.subject || ''} fullWidth sx={{ marginTop: '10px' }} />
                </Box>

                <Box sx={{ padding: '10px 15px', flexGrow: 1, overflow: 'auto' }}>
                    <Paper elevation={0} sx={{ minHeight: '200px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} >
                        <Editor
                            editorState={editorState}
                            onChange={handleEditorChange}
                        />
                    </Paper>
                </Box>

                {attachments.length > 0 && (
                    <Box padding="10px">
                        {attachments.map((file, index) => (
                            <Box key={index} display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f2f6fc" padding="5px" borderRadius="5px" marginBottom="5px">
                                <Typography variant="body2">{file}</Typography>
                                <IconButton onClick={() => removeAttachment(file)} size="small"> 
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" padding="5px 15px" bgcolor="#f2f6fc">
                    <Box display="flex" alignItems="center">
                        <Tooltip title="Attach File">
                            <IconButton component="label">
                                <AttachFile />
                                <input type="file" hidden multiple onChange={handleFileUpload} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert Emoji">
                            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                <InsertEmoticon />
                            </IconButton>
                        </Tooltip>
                        {showEmojiPicker && (
                            <Box position="absolute" bottom="50px" left="50px">
                                <Picker onEmojiClick={handleEmojiClick} />
                            </Box>
                        )}
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Button variant="contained" onClick={sendEmail} sx={{ textTransform: 'none' }}>Send</Button>
                        <Button onClick={saveAsDraft} sx={{ textTransform: 'none', marginLeft: '10px' }}>Save Draft</Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ComposeMail;
