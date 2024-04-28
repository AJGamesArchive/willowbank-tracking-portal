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

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';

// Importing UI components
import TeacherCard from '../../components/Teacher/TeacherCard';
import Banner from '../../components/Admin/AdminPortal/Banner';
import { Divider } from 'primereact/divider';

// React function to render the Teacher Portal page for desktop devices
const TeacherPortalDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();
  
  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const name : string = String(params.name?.charAt(0).toUpperCase()) + String(params.name?.substring(1).toLowerCase());

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
        <Banner 
          backgroundimage='/assets/teacher-portal-images/teacher-banner.png' 
          text={`Welcome ${name}`}/>
        <br />
        <TeacherCard
          title= "By Program"
          description='View Student Progress by Program'
          destinationPage={``}
        />
        <TeacherCard
          title= "By School"
          description='View Student Progress by School'
          destinationPage={``}
        />
        <TeacherCard
          title= "Manage account"
          description='Update account details'
          destinationPage={``}
        />
        <Divider />
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

export default TeacherPortalDesktop;
