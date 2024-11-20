import './App.css';
import { useEffect, useState } from 'react';
import ContactInfoForm from './claimant/modules/ContactInfoForm';
import { Routes, Route } from 'react-router-dom';
import { fetchClaimantContactInfo } from './api/claimantApiCalls';
import { useDispatch } from 'react-redux';
import { setContactInfo } from './redux/slices/claimantSlice';
import { useSelector } from 'react-redux';
import ZohoDocumentUploader from './components/ZohoDocumentUploader';
import DocumentUploader from './claimant/modules/DocumentUploader';
import { fetchClaimantUploads } from './api/adminApiCalls';
import ClaimantUploadsGrid from './admin/modules/ClaimantUploadsGrid';
import { Box } from '@mui/material';
import DocuSignAuth from './DocuSignAuth';
import Dashboard from './Dashboard';
import DocusignRedirect from './DocusignRedirect';
import AdminLogin from './admin/AdminLogin';
// import ClaimantLogin from './claimant/ClaimantLogin';
import AdminPortal from './admin/AdminPortal';
import AdminPortalLayout from './layouts/AdminPortalLayout';
import ClaimantPortalLayout from './layouts/ClaimantPortalLayout';
import ClaimantPortal from './claimant/ClaimantPortal'
import { EnvelopeCacheProvider } from './cache/EnvelopeCacheContext';
import LoginWithOverlay from './components/LoginWithOverlay';
// import MaintenancePage from './MaintenancePage';

const App = () => {
  const dispatch = useDispatch();
  //Redux State
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const isVerified = useSelector((state) => state.shared.isVerified);
  const matterInfo = useSelector((state) => state.claimant.matterInfo);

  const [rows, setRows] = useState([]);
  // const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if(isVerified) {
      fetchClaimantUploads(setRows);
    }
  }, [isVerified])


  useEffect(() => {
    async function fetchAndStoreContactInfo() {
      const matterInfoAvailable = matterInfo && Object.keys(matterInfo).length > 0;
      if(matterInfoAvailable) {
        const fetchedClaimantContactInfo = await fetchClaimantContactInfo(matterInfo.name); //use name instead of number
        if(fetchedClaimantContactInfo) {
          dispatch(setContactInfo(fetchedClaimantContactInfo));
        }
      }
    }
    fetchAndStoreContactInfo();
  }, [dispatch, matterInfo])


  const determineCurrentFlow = () => {
    console.log("IS VERIFIED AFTER REDIRECT?: ", isVerified);
    if (!isVerified) {
      return isAdmin ? <AdminLogin /> : <LoginWithOverlay />;
    } else if (isVerified && !isAdmin) {
      return <ClaimantPortalLayout />;
    } else {
      return <AdminPortalLayout />;
    }
  };
  
  return (
    <EnvelopeCacheProvider>
      <div className="App">
        <Routes>
          {/* MUST DEFINE REDIRECT ROUTE BEFORE HOME ROUTE */}
          <Route path="docusign-redirect" element={<DocusignRedirect/>} />

          <Route path="/" element={determineCurrentFlow()}>
          {/* <Route path="/" element={admin ? determineCurrentFlow() : <MaintenancePage  setAdmin={setAdmin}/>}> */}
            <Route index element={isAdmin ? <AdminPortal /> : <ClaimantPortal />} />
            <Route path="claimant/contactInfo" element={<ContactInfoForm/>} />
            <Route path="documentCreation/:id" element={<ZohoDocumentUploader />} />
            <Route path="admin/claimantUploads" element={<Box sx={{p: "2em 5em"}}><ClaimantUploadsGrid rows={rows} height={"750px"}/></Box>} />
            <Route path="claimant/documentUploader" element={<DocumentUploader />} />
            <Route path="admin/docusign" element={<DocuSignAuth />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </EnvelopeCacheProvider>
  );
};

export default App;
