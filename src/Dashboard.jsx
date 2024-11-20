import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserInfo } from './docusign';
import { storeTokensFromUrl } from './docusign';
import { useDispatch } from 'react-redux';
import { setUser, setAdmin } from './redux/slices/adminSlice';
import { setVerified } from './redux/slices/sharedSlice';

const Dashboard = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const { accessToken, email } = storeTokensFromUrl(location) || {};
    
        if (accessToken) {
            setAccessToken(accessToken);
        }
    
        if (email) {
            dispatch(setUser(email));
            setAdmin(true);
            setVerified(true);
        }
    }, [location, dispatch]);

    useEffect(() => {
      const getUserInfo = async () => {
          if (accessToken) {
              try {
                  const fetchedUserInfo = await fetchUserInfo(); // Await the response
                  setUserInfo(fetchedUserInfo); // Set the user info with the response
              } catch (error) {
                  console.error('Failed to fetch user info:', error);
              }
          }
      };
  
      getUserInfo(); // Call the async function
  }, [accessToken]);
  
    useEffect(() => {
      if (userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          console.log('Local Storage saved userInfo:', userInfo);
      }
     }, [userInfo]);

    return (
        <div>
            <h1>Dashboard</h1>
            {accessToken ? (
                <div>
                    <h2>Authenticated with DocuSign</h2>
                    {userInfo ? (
                        <div>
                            <p>Name: {userInfo.name}</p>
                            <p>Email: {userInfo.email}</p>
                        </div>
                    ) : (
                        <p>Loading user info...</p>
                    )}
                </div>
            ) : (
                <p>No access token found. Please log in.</p>
            )}
        </div>
    );
};

export default Dashboard;
