import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog, Box, InputBase, Button, MenuItem,
    IconButton, Typography, Paper, Tooltip, FormControlLabel, Checkbox
} from '@mui/material';
import { Close, DeleteOutline, AttachFile } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const dialogStyle = {
    height: '90%',
    width: '80%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    borderRadius: '10px 10px 0 0',
};

const exampleGroups = [
    { name: 'Group 1', emails: ['email1@example.com', 'email2@example.com'] },
    { name: 'Group 2', emails: ['email3@example.com', 'email4@example.com'] },
    { name: 'Group 3', emails: ['email5@example.com', 'email6@example.com'] },
    { name: 'Group 4', emails: ['email7@example.com', 'email8@example.com'] }
];

const ComposeMail = ({ open, setOpenDrawer, isDarkTheme }) => {
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
    const [data, setData] = useState({});
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const draftData = location.state?.draft; // Retrieve draft data from state

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) {
            setLoggedInUserEmail(user.email);
            setData(prevData => ({ ...prevData, from: user.email }));
        }

        if (draftData) {
            console.log("Draft data received:", draftData);
            setData({
                _id:draftData._id || '',
                to: draftData.to || '',
                cc: draftData.cc || '',
                bcc: draftData.bcc || '',
                subject: draftData.subject || '',
                from: draftData.from || '',
                body: draftData.body || '',
            });
            setAttachments(draftData.attachments || []);
        }
    }, [draftData]);

    const theme = {
        backgroundColor: isDarkTheme ? '#1a1a1a' : '#ffffff',
        textColor: isDarkTheme ? '#ffffff' : '#000000',
        inputBackgroundColor: isDarkTheme ? '#333333' : '#f2f6fc',
        borderColor: isDarkTheme ? '#444444' : '#cccccc',
        hoverColor: isDarkTheme ? '#2c2c2c' : '#e6e6e6',
    };

    const onValueChange = useCallback((e) => {
        setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    }, []);

    const handleGroupSelection = useCallback((groupName) => {
        setSelectedGroups(prevGroups => {
            const updatedGroups = prevGroups.includes(groupName)
                ? prevGroups.filter(group => group !== groupName)
                : [...prevGroups, groupName];

            const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
            const selectedEmails = exampleGroups
                .filter(group => updatedGroups.includes(group.name))
                .flatMap(group => group.emails);

            const allEmails = Array.from(new Set([...typedEmails, ...selectedEmails]));
            setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));

            return updatedGroups;
        });
    }, [data.to]);

    const handleFileUpload = useCallback((event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newAttachments = Array.from(files).map(file => file.name);
            setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
        }
    }, []);

    const removeAttachment = useCallback((fileName) => {
        setAttachments(prevAttachments => prevAttachments.filter(file => file !== fileName));
    }, []);

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
                attachments: attachments,
            };
    
            console.log("Attempting to send email with data:", emailData);
            const response = await axios.post(`http://localhost:1973/api/send`, emailData);
            console.log('Response from server:', response.data);
    
            // If this was a draft, delete it from the database
            if (draftData?._id) {
                await axios.delete(`http://localhost:1973/api/drafts/${draftData._id}`);
                console.log('Draft deleted successfully');
            }
    
            navigate('/app/inbox'); 
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };
    

    const saveAsDraft = useCallback(async () => {
        
        try {
            const draftData = {
                _id: data._id , 
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
            navigate('/app/inbox'); 
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }, [data, attachments, loggedInUserEmail]);


    const clearAllFields = useCallback(() => {
        setData({
            to: '',
            cc: '',
            bcc: '',
            subject: '',
            body: '',
            from: loggedInUserEmail
        });
        setAttachments([]);
        setShowDropdown(false);
        setSelectedGroups([]);
    }, [loggedInUserEmail]);

    const handleClose = () => {
        clearAllFields();
        setOpenDrawer(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    ...dialogStyle,
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor
                }
            }}
        >
            <Box display="flex" flexDirection="column" height="100%" sx={{ backgroundColor: theme.backgroundColor }}>
                <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor={theme.backgroundColor}>
                    <Typography variant="subtitle1" style={{ fontSize: '1rem', color: theme.textColor }}>New Message</Typography>
                    <IconButton onClick={handleClose} sx={{ color: theme.textColor }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                <Box padding="0 15px">
                    <InputBase
                        placeholder='Recipients'
                        name="to"
                        onChange={onValueChange}
                        value={data.to || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                    {showDropdown && (
                        <Box sx={{ maxHeight: '150px', overflowY: 'auto', position: 'absolute', zIndex: 1, width: '100%', bgcolor: theme.inputBackgroundColor }}>
                            {exampleGroups.map((group, index) => (
                                <MenuItem key={index} onClick={() => handleGroupSelection(group.name)}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={selectedGroups.includes(group.name)} />
                                        }
                                        label={`${group.name} (${group.emails.length} emails)`}
                                        sx={{ color: theme.textColor }}
                                    />
                                </MenuItem>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box padding="0 15px">
                    <InputBase
                        placeholder="CC"
                        name="cc"
                        onChange={onValueChange}
                        value={data.cc || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                    <InputBase
                        placeholder="BCC"
                        name="bcc"
                        onChange={onValueChange}
                        value={data.bcc || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                    <InputBase
                        placeholder="Subject"
                        name="subject"
                        onChange={onValueChange}
                        value={data.subject || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                </Box>

                <Box padding="0 15px">
                    <InputBase
                        placeholder="Body"
                        name="body"
                        onChange={onValueChange}
                        value={data.body || ''}
                        fullWidth
                        multiline
                        rows={10}
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                </Box>

                {attachments.length > 0 && (
                    <Paper sx={{
                        display: 'flex', padding: '10px', margin: '15px',
                        backgroundColor: theme.inputBackgroundColor, border: `1px solid ${theme.borderColor}`
                    }}>
                        <Typography variant="subtitle1" sx={{ color: theme.textColor }}>
                            Attachments:
                        </Typography>
                        <Box>
                            {attachments.map((attachment, index) => (
                                <Tooltip title="Remove attachment" key={index}>
                                    <Box sx={{
                                        display: 'flex',
                                        marginLeft: '10px',
                                        color: theme.textColor
                                    }}>
                                        {attachment}
                                        <IconButton onClick={() => removeAttachment(attachment)}>
                                            <DeleteOutline fontSize="small" sx={{ color: theme.textColor }} />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    </Paper>
                )}

                <Box display="flex" justifyContent="space-between" padding="10px 15px">
                    <Box display="flex" alignItems="center">
                        <Tooltip title="Attach file">
                            <IconButton component="label">
                                <AttachFile fontSize="small" sx={{ color: theme.textColor }} />
                                <input hidden type="file" onChange={handleFileUpload} multiple />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box>
                        <Button variant="outlined" onClick={saveAsDraft} sx={{ marginRight: '5px', color: theme.textColor }}>Save Draft</Button>
                        <Button variant="contained" onClick={sendEmail} sx={{ backgroundColor: '#1a73e8', color: '#ffffff' }}>Send</Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ComposeMail;
