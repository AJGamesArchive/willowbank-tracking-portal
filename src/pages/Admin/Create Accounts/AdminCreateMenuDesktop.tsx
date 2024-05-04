// Import core functions
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import '../../Shared CSS files/PortalDesktop.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { retrieveStaffData } from '../../../functions/Teacher/RetrieveStaffData';

// Importing UI components
import Banner from "../../../components/Admin/AdminPortal/Banner";
import MenuOption from '../../../components/Admin/AdminPortal/AdminMenuOption';
import SignOutOption from '../../../components/Admin/AdminPortal/AdminMenuSignOutOption';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';

// React function to render the Admin Portal page for desktop devices
const AdminPortalMobile: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable o store the logged in users data
  const [coreStaffData, setCoreStaffData] = useState<CoreStaffAccountDetails>();

  // State variable to control the account details updated confirmation message
  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function to retrieve all staff data required for the portal
  async function retrieveStaffDataHandler(): Promise<void> {
    const staffData = await retrieveStaffData((params.snowflake? params.snowflake : ''), "admins");
    if(typeof staffData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    setCoreStaffData((typeof staffData !== "string") ? staffData : coreStaffData);
    return;
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; }
      await retrieveStaffDataHandler();
      setIsLoggedIn(true); 
      return;
    };
    confirmLoginHandler();
    
  }, []); // Emptying process array to ensure handler only runs on initial render


  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <div>
        <Toast ref={toast}/>
        <Banner
          backgroundimage='/assets/admin-portal-images/banner.png' 
          text={`Account Creation`} 
        />

        <div>
          <div className="subheading">
          <h3>Please select from the following options.</h3>
          </div>
          <br />
          
          <ul className="list">
            <li className="listItem">
              <MenuOption 
                imageSRC={`/assets/admin-portal-images/student.png`}
                imageAltText='Student image'
                destinationPage={`/AddStudent/${params.snowflake}/${params.token}/${params.name}`}
                title='Create student'
              />
            </li>
            <li className="listItem">
              <MenuOption 
                imageSRC={`/assets/admin-portal-images/teacher.png`}
                imageAltText='Teacher image'
                destinationPage={`/adminportal/createaccount/teacher/${params.snowflake}/${params.token}/${params.name}`}
                title='Create teacher'
              />
            </li>
            <li className="listItem">
              <SignOutOption />
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Toast ref={toast}/>
        <ProgressSpinner/>
      </>
    );
  };
};

export default AdminPortalMobile;
