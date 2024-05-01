// Import core functions
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Importing UI components
import AccountListBox from '../../../components/Admin/AccountManage/AccountMangLists';
import AccountManageBoxs from '../../../components/Admin/AccountManage/AccountMangBoxs';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './AdminAccMangDesktop.css'
import './AdminAccMangGlobal.css'
import '../../Shared CSS files/PortalDesktop.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { Divider } from 'primereact/divider';
import Banner from '../../../components/Admin/AdminPortal/Banner';

// React function to render the Account Manager page for desktop devices
const AdminAccMangDesktop: React.FC = () => {
  const [selectedUsername, setSelectedUsername] = useState<any>(); 
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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
        <div>
          <Banner 
            backgroundimage=''
            text=''
          />
          <h3>Please select from the existing accounts.</h3>
          <AccountListBox 
            selectedUsername={selectedUsername}
            setSelectedUsername={setSelectedUsername}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <AccountManageBoxs
            selectedUsername={selectedUsername}
            setSelectedUsername={setSelectedUsername}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <Divider />
        

        <Button label="[DEV] Back" icon="pi pi-arrow-left" onClick={() => {
          window.location.href = `/home` //! DEV button to return to login page - remove later
        }} severity="help"/>
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

export default AdminAccMangDesktop;
