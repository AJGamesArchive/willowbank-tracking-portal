// Import core functions
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams.ts';
import { useParams } from 'react-router';

// Import CSS
import './AdminResetDesktop.css'
import './AdminResetGlobal.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin.ts';

// Import UI components
import ResetList from '../../../components/Admin/ResetPasswordList.tsx';
import Banner from '../../../components/Admin/AdminPortal/Banner.tsx';

// React function to render the Admin Portal page for desktop devices
const AdminResetDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
      if (confirmed) { setIsLoggedIn(true); return; }
      window.location.href = `/home`;
      return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Banner
          backgroundimage='/assets/admin-portal-images/banner.png' 
          text={`Password Reset Requests`} 
        />
        <p>Please approve or ignore the following password reset requests.</p>
        <br />
        <ResetList/>
      </>
    );
  } else {
    return (
      <>
        <ProgressSpinner/>
      </>
    );
  };
};

export default AdminResetDesktop;
