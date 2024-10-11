import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Dialog, Box, InputBase, Button, MenuItem,
    IconButton, Typography, Paper, Tooltip, FormControlLabel, Checkbox
} from '@mui/material';
import { Close, DeleteOutline, AttachFile, InsertEmoticon, Schedule } from '@mui/icons-material';
import { Picker } from 'emoji-mart';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import draftToHtml from 'draftjs-to-html';
import 'react-datepicker/dist/react-datepicker.css';
import { debounce } from 'lodash';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

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

const ComposeMail = ({ open, setOpenDrawer }) => {
    const [data, setData] = useState({});
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [selectedFile, setSelectedFile] = useState(null);
    const [scheduleDate, setScheduleDate] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const config = {
        Username: process.env.REACT_APP_USERNAME,
        Password: process.env.REACT_APP_PASSWORD,
        Host: 'smtp.elasticemail.com',
        Port: 2525,
    };

    const onValueChange = useCallback((e) => {
        if (e.target.name === 'to') {
            const inputEmails = e.target.value.split(',').map(email => email.trim());
            const selectedEmails = exampleGroups
                .filter(group => selectedGroups.includes(group.name))
                .flatMap(group => group.emails);

            const allEmails = Array.from(new Set([...inputEmails, ...selectedEmails]));
            setData(prevData => ({ ...prevData, [e.target.name]: allEmails.join(', ') }));
        } else {
            setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
        }
    }, [selectedGroups]);

    const handleGroupSelection = useCallback((groupName) => {
        setSelectedGroups(prevGroups => {
            const updatedGroups = prevGroups.includes(groupName)
                ? prevGroups.filter(group => group !== groupName)
                : [...prevGroups, groupName];
    
            const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
            const selectedEmails = exampleGroups
                .filter(group => updatedGroups.includes(group.name))
                .flatMap(group => group.emails);
    
            // Remove emails from the unselected group
            const removedEmails = prevGroups.includes(groupName) 
                ? exampleGroups.find(group => group.name === groupName)?.emails || [] 
                : [];
    
            // Filter out the removed emails from the typed emails
            const allEmails = Array.from(new Set([
                ...typedEmails.filter(email => !removedEmails.includes(email)),
                ...selectedEmails
            ]));
    
            setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));
    
            return updatedGroups;
        });
    }, [data.to]);

    const handleEmojiSelect = useCallback((emoji) => {
        const contentState = editorState.getCurrentContent();
        const newContentState = ContentState.createFromText(contentState.getPlainText() + emoji.native);
        setEditorState(EditorState.push(editorState, newContentState));
        setShowEmojiPicker(false);
    }, [editorState]);
    

    const handleEditorChange = useCallback((state) => {
        setEditorState(state);
        setData(prevData => ({ ...prevData, body: draftToHtml(convertToRaw(state.getCurrentContent())) }));
    }, []);

    const handleFileUpload = useCallback((event) => {
        setSelectedFile(event.target.files[0]);
    }, []);

    const debouncedSaveDraft = useCallback(
        debounce(() => {
            const payload = {
                ...data,
                body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                date: new Date(),
                type: 'drafts',
            };
        }, 5000),
        [data, editorState]
    );

    useEffect(() => {
        debouncedSaveDraft();
        return debouncedSaveDraft.cancel;
    }, [data, editorState, debouncedSaveDraft]);

    const sendEmail = useCallback(async (e) => {
        e.preventDefault();

        if (window.Email) {
            try {
                const message = await window.Email.send({
                    ...config,
                    To: data.to,
                    From: "jeevan261122@gmail.com",
                    Subject: data.subject,
                    Body: data.body,
                    Attachments: selectedFile ? [{ name: selectedFile.name, data: selectedFile }] : [],
                });
                alert(message);

                const payload = {
                    ...data,
                    body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                    date: new Date(),
                    type: 'sent',
                    attachment: selectedFile ? selectedFile.name : '',
                };

                setOpenDrawer(false);
                clearAllFields();
            } catch (error) {
                console.error('Error sending email:', error);
                alert('Failed to send email. Please try again.');
            }
        } else {
            alert('Email service is not available');
        }
    }, [data, editorState, selectedFile, config, setOpenDrawer]);

    const clearAllFields = useCallback(() => {
        setData({
            to: '',
            cc: '',
            bcc: '',
            subject: '',
            body: ''
        });
        setEditorState(EditorState.createEmpty());
        setSelectedFile(null);
        setShowDropdown(false);
        setSelectedGroups([]);
        setShowEmojiPicker(false);
        setScheduleDate(null);
    }, []);

    const memoizedToolbar = useMemo(() => <Toolbar />, []);

    return (
        <Dialog open={open} PaperProps={{ sx: dialogStyle }}>
            <Box display="flex" flexDirection="column" height="100%">
                <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor="#f2f6fc">
                <Typography variant="subtitle1" style={{ fontSize: '1rem' }}>New Message</Typography>
                <IconButton onClick={() => { setOpenDrawer(false); clearAllFields(); }}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>
 
                <Box padding="0 15px">
                    <Box position="relative">
                        <InputBase
                            placeholder='Recipients'
                            name="to"
                            onChange={onValueChange}
                            value={data.to || ''}
                            fullWidth
                            onClick={() => setShowDropdown(prev => !prev)}
                        />
                        {showDropdown && (
                            <Box sx={{
                                position: 'absolute',
                                zIndex: 1,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                marginTop: '2px',
                                maxHeight: '170px',
                                overflowY: 'auto',
                                width: '100%'
                            }}>
                                <Typography variant="subtitle2" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                                Select Groups
                                </Typography>
                                {exampleGroups.map((group, index) => (
                                    <MenuItem key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedGroups.includes(group.name)}
                                                    onChange={() => handleGroupSelection(group.name)}
                                                />
                                            }
                                            label={group.name}
                                            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
                                        />
                                    </MenuItem>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <InputBase placeholder='Cc' name="cc" onChange={onValueChange} value={data.cc || ''} fullWidth />
                    <InputBase placeholder='Bcc' name="bcc" onChange={onValueChange} value={data.bcc || ''} fullWidth />
                    <InputBase placeholder='Subject' name="subject" onChange={onValueChange} value={data.subject || ''} fullWidth />
                </Box>

                <Box flex="1" padding="15px" overflow="auto">
                    {memoizedToolbar}
                    <Paper variant="outlined" style={{ padding: '10px', minHeight: '300px' }}>
                        <Editor
                            editorState={editorState}
                            onChange={handleEditorChange}
                            plugins={plugins}
                        />
                    </Paper>
                    {showEmojiPicker && <Picker onSelect={handleEmojiSelect} />}
                </Box>

                <Box display="flex" justifyContent="space-between" padding="10px 15px" alignItems="center">
                    <div>
                        <Button variant="contained" color="primary" onClick={sendEmail}>Send</Button>
                        <Tooltip title="Attach file">
                            <IconButton component="label">
                                <AttachFile />
                                <input type="file" hidden onChange={handleFileUpload} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert emoji">
                            <IconButton onClick={() => setShowEmojiPicker(prev => !prev)}>
                                <InsertEmoticon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Send">
                            <IconButton onClick={() => setScheduleDate(new Date())}>
                                <Schedule />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Tooltip title="Clear all fields">
                        <IconButton onClick={clearAllFields}>
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ComposeMail;