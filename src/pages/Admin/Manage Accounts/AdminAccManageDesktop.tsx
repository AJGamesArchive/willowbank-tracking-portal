// Import core functions
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

// Importing UI components
import AccountListBox from '../../../components/Admin/AccountManage/AccountMangLists';
import Banner from '../../../components/Admin/AdminPortal/Banner';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Import CSS
import './AdminAccManageDesktop.css'
import './AdminAccManageGlobal.css'
import '../../Shared CSS files/PortalDesktop.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { getStaffAccountInfo } from '../../../functions/Admin/getstaffAccountInfo';
import { getStudentAccountInfo } from '../../../functions/Admin/getstudentAccountInfo';

// React function to render the Account Manager page for desktop devices
const AdminAccMangDesktop: React.FC = () => {

  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  // State variables to store all account details
  const [allStudents, setAllStudents] = useState<CoreStudentAccountDetails[]>([]);
  const [allTeachers, setAllTeachers] = useState<CoreStaffAccountDetails[]>([]);
  const [allAdmins, setAllAdmins] = useState<CoreStaffAccountDetails[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Function to handel retrieving account data
  async function retrieveAllAccountDataHandler(): Promise<void> {
    // Retrieve data
    const studentData: CoreStudentAccountDetails[] | string = await getStudentAccountInfo();
    const teacherData: CoreStaffAccountDetails[] | string = await getStaffAccountInfo("teachers");
    const adminData:  CoreStaffAccountDetails[]  | string = await getStaffAccountInfo("admins");

    // Validate data
    if(typeof studentData === "string" || typeof teacherData === "string" || typeof adminData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };

    // Save retrieved data
    setAllStudents((typeof studentData !== "string") ? studentData : allStudents);
    setAllTeachers((typeof teacherData !== "string") ? teacherData : allTeachers);
    setAllAdmins((typeof adminData !== "string") ? adminData : allAdmins);
    return;
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; return; }
      await retrieveAllAccountDataHandler();
      setIsLoggedIn(true);
      return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // UseEffect hook to reload the page upon the re-load callback triggering
  useEffect(() => {
    const reloadHandler = async () => {await retrieveAllAccountDataHandler(); setIsLoggedIn(true);};
    if(reload) {
      setIsLoggedIn(false);
      reloadHandler();
      setReload(false);
      toast.current?.show({
        severity: `success`,
        summary: `Account Updated`,
        detail: `The account details have been updated successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
  }, [reload]); // Trigger each time the reload state is updated

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Toast ref={toast}/>
        <div>
          <Banner 
            backgroundimage='/assets/admin-portal-images/banner.png'
            text='Manage Accounts'
          />

          <AccountListBox 
            setReload={setReload}
            allStudents={allStudents}
            allTeachers={allTeachers}
            allAdmins={allAdmins}
            // 
          />
        </div>
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

export default AdminAccMangDesktop;
