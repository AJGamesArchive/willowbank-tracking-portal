// Import core functions
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

// Import global parameters
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import '../Shared CSS files/PortalDesktop.css'

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';
import { retrieveStaffData } from '../../functions/Teacher/RetrieveStaffData';
import { FindTeacherSchools } from '../../functions/Teacher/FindTeacherSchools';

// Importing UI components
import Banner from '../../components/Admin/AdminPortal/Banner';
import MenuOption from '../../components/Admin/AdminPortal/AdminMenuOption';
import SignOutOption from '../../components/Admin/AdminPortal/AdminMenuSignOutOption';
import EditAccountDetails from '../../components/Global/EditAccountDetails';
import TeacherSchoolData from '../../components/Teacher/TeacherSchoolData';

// Import types
import { CoreStaffAccountDetails } from '../../types/Global/UserAccountDetails';
import ModifyOption from '../../components/Admin/AdminPortal/AdminMenuOptionChangeDetails';
import { TeacherTimes } from '../../types/Teacher/TeacherTimes';
import { BlockUI } from 'primereact/blockui';


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

  const[teacherTimetables, setTeacherTimetables ] = useState<TeacherTimes[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);
  
  // Display the users name in a normal casing format
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
    
    const teacherData : string | TeacherTimes[]= await FindTeacherSchools((params.snowflake) ? params.snowflake : '');
    if(typeof teacherData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    }

    setTeacherTimetables((typeof teacherData !== "string") ? teacherData : teacherTimetables);
    return;
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("teachers", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; return; }
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
          text={`Welcome ${name}`}
        />

          <h3>Please find your timetables per school below.</h3>
          {teacherTimetables.map((timetable, index) => (
            <div>
              <TeacherSchoolData
                schoolName={timetable.schoolName}
                timetable={timetable.timetables}
                index={index}
              />
            </div>
          ))}
          <div>
            <div className="subheading">
            <h3>Please select from the following options.</h3>
          </div>
            
            <br />
          <ul className="list">
            <li className="listItem">
              <BlockUI blocked={true}>
                <MenuOption 
                  imageSRC='/assets/teacher-portal-images/by-program.png'
                  imageAltText='Program image'
                  title='Students by program'
                  destinationPage=''
                />
              </BlockUI>
            </li>
            <li className="listItem">
              <BlockUI blocked={true}>
                <MenuOption
                  imageSRC='/assets/teacher-portal-images/by-school.png'
                  imageAltText='School image'
                  title='View students by school'
                  destinationPage='' />
              </BlockUI>
            </li>
            <li className="listItem">
              <div onClick={() => setVisibleEditDetails(true)}>
                <ModifyOption
                  imageSRC={`/assets/teacher-portal-images/settings.png`}
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
