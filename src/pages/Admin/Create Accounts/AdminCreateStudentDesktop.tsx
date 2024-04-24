// Import core functions
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';
import StudentCreationForm from '../../../components/Login/StudentCreateAccount';

import './AdminCreateStudentDesktop.css'
import './AdminCreateStudentGlobal.css'

const AdminCreateStudentDesktop: React.FC = () => {
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
            <StudentCreationForm 
              accountType={'student'} 
              visible={true} 
              setVisible={() => {}} 
              setOptionMenuVisible={() => {}}
            />
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
  
export default AdminCreateStudentDesktop