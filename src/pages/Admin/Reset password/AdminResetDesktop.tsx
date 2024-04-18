// Import core functions
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams.ts';
import { useParams } from 'react-router';

// Import CSS
import './AdminResetDesktop.css'
import './AdminResetGlobal.css'
import '../../../components/Admin/AdminCard.tsx'
import { getResetRequests } from '../../../functions/Global/GetResetRequests.ts';
import { PasswordRequest } from '../../../types/Global/PasswordRequest.ts'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import ResetList from '../../../components/Admin/ResetPasswordList.tsx';

// React function to render the Admin Portal page for desktop devices
const AdminResetDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();
  const [request, setRequests] = useState<PasswordRequest[]>([]);

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.username, params.token);
      if (confirmed) { setIsLoggedIn(true); return; }
      window.location.href = `/home`;
      var username: string[] = [];
      request.forEach(element => { username.push(element.username); });
      return;
    };
    confirmLoginHandler();
    aGetRequests();
  }, []); // Emptying process array to ensure handler only runs on initial render

  async function aGetRequests ()
  {
    const requestsArray = await getResetRequests();
    if ( typeof requestsArray === "string")
    {
      return;
    }
    setRequests(requestsArray)
    return;
  }
  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <h1>Reset student's password</h1>
        <p>Please approve or ignore the following password reset requests.</p>
        <br />
        <ResetList requests={request}/>
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
