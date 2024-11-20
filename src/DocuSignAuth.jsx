import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const apiUrl = process.env.REACT_APP_API_URL;

const DocuSignAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const user = useSelector((state) => state.admin.user);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(`${apiUrl}/docusign/status`);
                setIsAuthenticated(response.data.isAuthenticated);

                if (response.data.isAuthenticated) {
                    getUserInfo();
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        checkAuthStatus(); // Call the function inside useEffect
    }, []);

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${apiUrl}/docusign/userinfo`);
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleLogin = () => {
        const email = user;
    
        if (!email) {
            alert('Please enter your email.');
            return;
        }
    
        // Construct the authorization URL with the email as a query parameter (state)
        const authUrl = `${apiUrl}/docusign/auth?email=${encodeURIComponent(email)}`;
        
        // Open the URL in a new tab
        window.open(authUrl, '_blank');
    };

    return (
        <div>
            {!isAuthenticated ? (
                <Button sx={{ mt: "20px" }} onClick={handleLogin}>
                    Login with DocuSign
                </Button>
            ) : (
                <div>
                    <h2>Authenticated with DocuSign</h2>
                    {userInfo && (
                        <div>
                            <p>Name: {userInfo.name}</p>
                            <p>Email: {userInfo.email}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocuSignAuth;