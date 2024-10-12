import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Dialog, IconButton, InputBase, Paper, Tooltip, Typography, Menu, MenuItem
} from '@mui/material';
import { AttachFile, DeleteOutline, InsertEmoticon, Close } from '@mui/icons-material';
import { EditorState } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Ensure you have Draft.js styles imported
import Picker from 'emoji-picker-react';
import debounce from 'lodash/debounce';
import { stateToHTML } from 'draft-js-export-html';

// Sample groups for demo purposes
const groups = [
    { label: 'Group 1', emails: ['user1@example.com', 'user2@example.com'] },
    { label: 'Group 2', emails: ['user3@example.com', 'user4@example.com'] },
];

const ComposeMail = ({ open, handleClose }) => {
    const [data, setData] = useState({ to: '', cc: '', bcc: '', subject: '', body: '' });
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [attachments, setAttachments] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    // For managing the dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);

    // Handle editor changes
    const handleEditorChange = (state) => {
        setEditorState(state);
        const contentState = state.getCurrentContent();
        const bodyText = stateToHTML(contentState);
        setData(prevData => ({ ...prevData, body: bodyText }));
    };

    // Save draft with debounce to avoid multiple rapid saves
    const saveDraft = useCallback(debounce(() => {
        console.log('Draft saved:', data);
    }, 2000), [data]);

    useEffect(() => {
        saveDraft();
        return () => {
            saveDraft.cancel();
        };
    }, [data, saveDraft]);

    // File upload handling
    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newAttachments = Array.from(files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                file
            }));
            setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
        }
    };

    // Remove attachment
    const removeAttachment = (fileName) => {
        setAttachments(prevAttachments => prevAttachments.filter(file => file.name !== fileName));
    };

    // Handle value changes
    const onValueChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    // Emoji selection
    const handleEmojiClick = (event, emojiObject) => {
        const contentState = editorState.getCurrentContent();
        const newContent = contentState.createEntity('emoji', 'IMMUTABLE', { emoji: emojiObject.emoji });
        const entityKey = newContent.getLastCreatedEntityKey();
        const newState = EditorState.set(editorState, { currentContent: newContent });
        setEditorState(newState);
    };

    // Send email
    const sendEmail = () => {
        console.log("Email sent with data:", data);
        console.log("Attachments:", attachments);
    };

    // Reset all fields
    const resetFields = () => {
        setData({ to: '', cc: '', bcc: '', subject: '', body: '' });
        setEditorState(EditorState.createEmpty());
        setAttachments([]);
    };

    // Open dropdown menu
    const handleToClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close dropdown menu
    const handleCloseDropdown = () => {
        setAnchorEl(null);
    };

    // Handle group selection
    const handleGroupSelect = (group) => {
        const emails = group.emails.join(', ');
        setData(prevData => ({ ...prevData, to: emails }));
        handleCloseDropdown(); // Close the dropdown after selection
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <Box display="flex" flexDirection="column" height="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px" bgcolor="#f2f6fc">
                    <Typography variant="h6">New Message</Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Box padding="10px">
                    <InputBase 
                        placeholder="To" 
                        onClick={handleToClick} // Open dropdown on click
                        value={data.to} 
                        fullWidth 
                        readOnly // Make it read-only to trigger dropdown
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
                    <Paper elevation={0} sx={{ minHeight: '200px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
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
                                <Typography variant="body2">{file.name} ({Math.round(file.size / 1024)} KB)</Typography>
                                <IconButton onClick={() => removeAttachment(file.name)} size="small">
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" padding="5px 15px" bgcolor="#f2f6fc">
                    <Box display="flex" alignItems="center">
                        <Tooltip title="Send">
                            <Button variant="contained" color="primary" onClick={sendEmail}>
                                Send
                            </Button>
                        </Tooltip>
                        <Tooltip title="Attach files">
                            <IconButton component="label" sx={{ ml: 1 }}>
                                <AttachFile />
                                <input type="file" hidden onChange={handleFileUpload} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert emoji">
                            <IconButton onClick={() => setShowEmojiPicker(prev => !prev)}>
                                <InsertEmoticon />
                            </IconButton>
                        </Tooltip>
                        {showEmojiPicker && (
                            <Box position="absolute" zIndex={1} top="60%" left="30%">
                                <Picker onEmojiClick={handleEmojiClick} />
                            </Box>
                        )}
                    </Box>
                    <IconButton onClick={resetFields}>
                        <DeleteOutline />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ComposeMail;
