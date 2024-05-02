// Import CSS
import '../../Shared CSS files/PortalDesktop.css'

// Import core functions
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';


// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { retrieveStaffData } from '../../../functions/Teacher/RetrieveStaffData';
import { retrieveActivityRequests } from '../../../functions/Admin/ActivityRequests/RetrieveAllActivityRequests';

// Importing UI components
import Banner from "../../../components/Admin/AdminPortal/Banner";
import MenuOption from '../../../components/Admin/AdminPortal/AdminMenuOption';
import SignOutOption from '../../../components/Admin/AdminPortal/AdminMenuSignOutOption';
import EditAccountDetails from '../../../components/Global/EditAccountDetails';
import ActivityCompletionRequestDialogue from '../../../components/Admin/ActivityCompletionRequests/ActivityRequestsDialogue';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';
import { ActivityRequests } from '../../../types/Global/ActivityCompletionRequests';
import ModifyOption from '../../../components/Admin/AdminPortal/AdminMenuOptionChangeDetails';

// React function to render the Admin Portal page for desktop devices
const AdminPortalDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable to store all active activity completion requests
  const [requests, setRequests] = useState<ActivityRequests[]>([]);

  // State variable o store the logged in users data
  const [coreStaffData, setCoreStaffData] = useState<CoreStaffAccountDetails>();

  // State variable to control the account details updated confirmation message
  const [detailConfirmation, setDetailConfirmation] = useState<boolean>(false);

  // State variable to control the visibility of the edit account details dialogue box
  const [visibleEditDetails, setVisibleEditDetails] = useState<boolean>(false);

  // State variable to control the visibility of the activity completion requests dialogue box
  const [visibleActivityRequests, setVisibleActivityRequests] = useState<boolean>(false);

  // State variables to block UI components
  const [blockButtons, setBlockButtons] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  const name : string = String(params.name?.charAt(0).toUpperCase()) + String(params.name?.substring(1).toLowerCase());

  // Async function to handel retrieving all active activity completion requests
  async function retrieveActivityRequestsHandler(): Promise<void> {
    setBlockButtons(true);
    const retrievedRequests = await retrieveActivityRequests();
    if(typeof retrievedRequests === "string") {
      toast.current?.show({
        severity: 'error',
        summary: 'Error Retrieving Requests',
        detail: `An error occurred while trying to retrieve all active activity completion requests. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setRequests([]);
      return;
    };
    setRequests(retrievedRequests);
    setVisibleActivityRequests(true);
    setBlockButtons(false);
    return;
  };

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
          backgroundimage='/assets/admin-portal-images/banner.png' 
          text={`Welcome ${name}`} 
        />

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
            <li className="listItem">
            <MenuOption 
              imageSRC={`/assets/admin-portal-images/create-student.png`}
              imageAltText='Create account image'
              destinationPage={`/adminportal/createaccount/${params.snowflake}/${params.token}/${params.name}`}
              title="Create new account" />
            </li>
            <li className='listItem'>
            <MenuOption 
              imageSRC={`/assets/admin-portal-images/Account.png`}
              imageAltText='Account image'
              destinationPage={`/AccManagement/${params.snowflake}/${params.token}/${params.name}`}
              title="Manage Accounts" />
            </li>
            <li className='listItem'>
            <MenuOption 
              imageSRC={`/assets/admin-portal-images/School.png`}
              imageAltText='School image'
              destinationPage={`/adminportal/manageschools/${params.snowflake}/${params.token}/${params.name}`}
              title="School management" />
            </li>
            <li className="listItem">
              <BlockUI blocked={blockButtons}>
                <div onClick={() => retrieveActivityRequestsHandler()}>
                  <ModifyOption 
                  imageSRC={`/assets/admin-portal-images/Activity.png`}
                  imageAltText='Account image'
                  title="Actvitiy requests" />
                </div>
              </BlockUI>
            </li>
            <li className="listItem">
              <div onClick={() => setVisibleEditDetails(true)}>
                <ModifyOption
                  imageSRC={`/assets/admin-portal-images/Settings.png`}
                  imageAltText='Settings image'
                  title="Account details" />
              </div>
            </li>
            <li className="listItem">
              <SignOutOption />
            </li>
          </ul>
        </div>
        <EditAccountDetails
          accountType='admins'
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
        <ActivityCompletionRequestDialogue
          visible={visibleActivityRequests}
          setVisible={setVisibleActivityRequests}
          requests={requests}
        />
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

export default AdminPortalDesktop;
