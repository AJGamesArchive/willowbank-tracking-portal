// Import core functions
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Importing UI components
import AccountListBox from '../../../components/Admin/AccountManage/AccountMangLists';
import AccountManageBoxs from '../../../components/Admin/AccountManage/AccountMangBoxs';
import CreateStudentButton from '../../../components/Admin/AccountManage/NavCreateAccount';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './AdminAccMangDesktop.css'
import './AdminAccMangGlobal.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { Divider } from 'primereact/divider';

// React function to render the Account Manager page for desktop devices
const AdminAccMangDesktop: React.FC = () => {
  const [selectedUsername, setSelectedUsername] = useState<string>(""); 
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
          <h1>Existing accounts</h1>
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

        <h1>Create a new account</h1>
        <div>
          <CreateStudentButton AccountType='student' />
          <CreateStudentButton AccountType='teacher' />
        </div>
        <div></div>
        
        <div className='buttonContainer'>
          <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
          setSelectedUsername(""); //goes back to the list pages
          }} severity="secondary"/>
        </div>

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
