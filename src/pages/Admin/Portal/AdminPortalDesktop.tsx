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
import Banner from "../../../components/Admin/AdminPortal/Banner";
import MenuOption from '../../../components/Admin/AdminPortal/AdminMenuOption';

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
      <div>
        <Banner
          backgroundimage='https://marketplace.canva.com/EAENvp21inc/1/0/1600w/canva-simple-work-linkedin-banner-qt_TMRJF4m0.jpg' 
          text={`WELCOME ${params.name?.toUpperCase()}`} />

        <div>
          <div className="subheading">
          <h3>Please select from the following options.</h3>
          </div>
          
          <br />
          <ul className="list">
            <li className="listItem">
              <MenuOption 
                imageSRC={`/assets/admin-portal-images/Padlock.png`}
                imageAltText='Key'
                destinationPage={`/adminportal/resetpassword/${params.snowflake}/${params.token}/${params.name}`}
                title='Reset password'
              />
            </li>
            <li className="listItem">
              <MenuOption 
                imageSRC={`/assets/admin-portal-images/Course.png`}
                imageAltText='Program image'
                destinationPage={`/adminportal/manageprograms/${params.snowflake}/${params.token}/${params.name}`}
                title='Program management'
              />
            </li>
            <li className='listItem'>
            <MenuOption 
              imageSRC={`/assets/admin-portal-images/Account.png`}
              imageAltText='Account image'
              destinationPage={`/AccManagement/${params.snowflake}/${params.token}/${params.name}`}
              title="Account management" />
            </li>
            <li className='listItem'>
            <MenuOption 
              imageSRC={`/assets/admin-portal-images/School.png`}
              imageAltText='School image'
              destinationPage={`/adminportal/resetpassword/${params.snowflake}/${params.token}/${params.name}`}
              title="School management" />
            </li>
          </ul>
        </div>
      
        <Divider />
        <Button label="Sign-Out" icon="pi pi-sign-out" onClick={() => {
          window.location.href = `/home`
        }} severity="danger"/>
      </div>
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
