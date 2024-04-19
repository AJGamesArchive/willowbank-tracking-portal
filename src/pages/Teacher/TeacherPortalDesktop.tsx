// Import core functions
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './TeacherPortalDesktop.css'
import './TeacherPortalGlobal.css'
import TeacherCard from '../../components/Teacher/TeacherCard';

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';

// React function to render the Teacher Portal page for desktop devices
const TeacherPortalDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("teachers", params.username, params.token);
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
        <h1>Desktop UI Code</h1>
        <h1>Teacher Portal</h1>
        <h2>{params.username}</h2>
        <h2>{params.token}</h2>
        <TeacherCard
          title= "By Program"
          description='View Student Progress by Program'
          destinationPage={``}
        />
        <Button label="Sign-Out" icon="pi pi-sign-out" onClick={() => {
          window.location.href = `/home`
        }} severity="warning"/>
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

export default TeacherPortalDesktop;
