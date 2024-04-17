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
import '../../../components/Admin/AdminCard.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { Divider } from 'primereact/divider';
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
        <h1>Welcome {params.username}</h1>
        <p>Please select from the following options.</p>
        <br />
        <AdminCard title="View password request resets" 
        description="Reset passwords for teachers and students."
        destinationPage={`/adminportal/resetpassword/${params.username}/${params.token}`} />
        <AdminCard title="Manage accounts"
        description="Create, modify or delete accounts. Modify a student's progress."
        destinationPage= {`/adminportal/AccountManagement/${params.username}/${params.token}`}/>  
        <AdminCard title="Manage schools"
        description="Create, modify or delete schools."
        destinationPage=""/>
        <AdminCard title="Manage Activites"
        description="Create or delete activities."
        destinationPage=""/>
        <Divider />
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

export default AdminPortalDesktop;
