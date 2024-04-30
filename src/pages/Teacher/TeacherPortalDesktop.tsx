// Import core functions
import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';

// Import global parameters
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './TeacherPortalDesktop.css'
import './TeacherPortalGlobal.css'

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';
import { retrieveStaffData } from '../../functions/Teacher/RetrieveStaffData';

// Importing UI components
import TeacherCard from '../../components/Teacher/TeacherCard';
import Banner from '../../components/Admin/AdminPortal/Banner';
import EditAccountDetails from '../../components/Global/EditAccountDetails';

// Import types
import { CoreStaffAccountDetails } from '../../types/Global/UserAccountDetails';

// React function to render the Teacher Portal page for desktop devices
const TeacherPortalDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();
  
  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable o store the logged in users data
  const [coreStaffData, setCoreStaffData] = useState<CoreStaffAccountDetails>();

  // State variable to control the account details updated confirmation message
  const [detailConfirmation, setDetailConfirmation] = useState<boolean>(false);

  // State variable to control the visibility of the edit account details dialogue box
  const [visibleEditDetails, setVisibleEditDetails] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);
  
  const name : string = String(params.name?.charAt(0).toUpperCase()) + String(params.name?.substring(1).toLowerCase());

  // Async function to retrieve all staff data required for the portal
  async function retrieveStaffDataHandler(): Promise<void> {
    const staffData = await retrieveStaffData((params.snowflake? params.snowflake : ''), "teachers");
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
      const confirmed: boolean = await confirmLogin("teachers", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; }
      await retrieveStaffDataHandler();
      setIsLoggedIn(true);
      return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Event handler to handel showing detail confirmation messages
  useEffect(() => {
    if(detailConfirmation) {
      toast.current?.show({
        severity: `success`,
        summary: `Details Updated`,
        detail: `You're account details were updated successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
  }, [detailConfirmation]);

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Toast ref={toast}/>
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
        <EditAccountDetails
          accountType='teachers'
          snowflake={(coreStaffData) ? coreStaffData.snowflake : ''}
          token={(params.token) ? params.token : ''}
          existingFirstName={(coreStaffData) ? coreStaffData.firstName : ''}
          existingSurnameI={(coreStaffData) ? coreStaffData.surname : ''}
          existingUsername={(coreStaffData) ? coreStaffData.username : ''}
          existingPassword={(coreStaffData) ? coreStaffData.password : ''}
          visible={visibleEditDetails}
          setVisible={setVisibleEditDetails}
          setIsLoggedIn={setIsLoggedIn}
          setDetailConfirmation={setDetailConfirmation}
        />
        <Divider />
        <Button label="Edit Account Details" icon="pi pi-cog" onClick={() => setVisibleEditDetails(true)} severity="success"/>
        <Divider />
        <Button label="Sign-Out" icon="pi pi-sign-out" onClick={() => {
          window.location.href = `/home`
        }} severity="danger"/>
      </>
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

export default TeacherPortalDesktop;
