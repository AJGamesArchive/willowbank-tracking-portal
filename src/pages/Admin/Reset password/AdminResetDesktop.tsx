// Import core functions
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './AdminResetDesktop.css'
import './AdminResetGlobal.css'
import '../../../components/Admin/admin.css'
import '../../../components/Admin/resetpasswordlist'
import { getResetRequests } from '../../../functions/Global/GetResetRequests.ts';

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import ResetList from '../../../components/Admin/resetpasswordlist';

async function aGetRequests ()
{
    const requests: string | string[] = await getResetRequests();

    if (typeof requests == 'string')
        return [requests];
    return requests;
}

// React function to render the Admin Portal page for desktop devices
const AdminResetDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.username, params.token);
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
        <h1>Reset student's password</h1>
        <p>Please approve or decline the following password reset requests.</p>
        <br />
        
        <ResetList requests={aGetRequests} />

        <br />
        <Button label="[DEV] Back" icon="pi pi-arrow-left" onClick={() => {
          window.location.href = `/home` //! DEV button to return to login page - remove later
        }} severity="secondary"/>
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
