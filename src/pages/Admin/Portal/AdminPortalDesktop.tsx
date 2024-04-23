// Import core functions
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './AdminPortalDesktop.css'
import './AdminPortalGlobal.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { Divider } from 'primereact/divider';

// Importing UI components
import AdminCard from '../../../components/Admin/AdminCard';

// React function to render the Admin Portal page for desktop devices
const AdminPortalDesktop: React.FC = () => {
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
        <h1>Welcome {params.name}</h1>
        <h2>{params.snowflake}</h2>
        <h2>{params.token}</h2>
        <p>Please select from the following options.</p>
        <br />
        <AdminCard title="View password request resets" 
        description="Reset passwords for teachers and students."
        destinationPage={`/adminportal/resetpassword/${params.snowflake}/${params.token}/${params.name}`} />
        <AdminCard title="Manage Programs & Activities" 
        description="Add, Edit, Remove, and update programs and program activities."
        destinationPage={`/adminportal/manageprograms/${params.snowflake}/${params.token}/${params.name}`} />
        <AdminCard title="Manage accounts"
        description="Create, modify or delete accounts. Modify a student's progress."
        destinationPage={`/AccManagement/${params.snowflake}/${params.token}/${params.name}`}/> 
        <AdminCard title="Manage schools"
        description="Create, modify or delete schools."
        destinationPage=""/>
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

export default AdminPortalDesktop;
