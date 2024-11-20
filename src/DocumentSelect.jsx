import React, { useState } from 'react';
import { Select, MenuItem, Button, Snackbar } from '@mui/material';
import { createDocument } from './docusign';

// Mock function to simulate fetching document data
const fetchDocumentData = (documentName) => {
    const documents = {
        'Document 1': 'BASE64_ENCODED_DOCUMENT_1',
        'Document 2': 'BASE64_ENCODED_DOCUMENT_2',
        // Add more documents as needed
    };
    return documents[documentName] || null; // Return document data or null if not found
};

const DocumentSelect = () => {
    const [selectedDocument, setSelectedDocument] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [documentData, setDocumentData] = useState(''); // State for document data
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const documentNames = ['Document 1', 'Document 2']; // Example document names

    const handleDocumentChange = (event) => {
        const name = event.target.value;
        setSelectedDocument(name);
        const data = fetchDocumentData(name); // Fetch document data when a document is selected
        setDocumentData(data);
    };

    const handleSaveDocument = async () => {
        if (!selectedDocument || !documentName || !documentId) {
            setSnackbarMessage('Please fill in all fields.');
            setSnackbarOpen(true);
            return;
        }

        try {
            // Call createDocument API with the data from state
            await createDocument(documentData, documentName, documentId);
            setSnackbarMessage('Document created successfully!');
        } catch (error) {
            console.error('Error creating document:', error);
            setSnackbarMessage('Failed to create document.');
        } finally {
            setSnackbarOpen(true);
        }
    };

    return (
        <div>
            <Select value={selectedDocument} onChange={handleDocumentChange}>
                {documentNames.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
            <input 
                type="text" 
                placeholder="Document Name" 
                value={documentName} 
                onChange={(e) => setDocumentName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Document ID" 
                value={documentId} 
                onChange={(e) => setDocumentId(e.target.value)} 
            />
            <Button onClick={handleSaveDocument}>Save Document</Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
};

export default DocumentSelect;
