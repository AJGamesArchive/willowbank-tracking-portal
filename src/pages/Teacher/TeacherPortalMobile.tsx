// Import core functions
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './TeacherPortalMobile.css'

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';

// React function to render the Teacher Portal page for mobile devices
const TeacherPortalMobile: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("teachers", params.snowflake, params.token);
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
        <h1>Mobile UI Code</h1>
        <h1>Teacher Portal</h1>
        <h2>{params.name}</h2>
        <h2>{params.snowflake}</h2>
        <h2>{params.token}</h2>
        <Button label="Sign-Out" icon="pi pi-sign-out" onClick={() => {
          window.location.href = `/home`
        }} severity="danger"/>
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

export default TeacherPortalMobile;
