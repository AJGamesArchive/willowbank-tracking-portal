// Import core functions
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './AwardRevokeXPDesktop.css'

// Import types
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { getStudentAccountInfo } from '../../../functions/Admin/getstudentAccountInfo';

// React function to render the award/revoke xp page for mobile devices
const AwardRevokeXPDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable to store all student data
  const [studentData, setStudentData] = useState<CoreStudentAccountDetails[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function t retrieve all student data from the DB
  async function retrieveAllStudents(): Promise<void> {
    const baseStudentData: CoreStudentAccountDetails[] | string = await getStudentAccountInfo();
    if(typeof baseStudentData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };
    setStudentData(baseStudentData);
    return;
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
      if (!confirmed) {  window.location.href = `/home`; return; }
      await retrieveAllStudents();
      setIsLoggedIn(true);
      return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Defining student card header template
  const cardHeader = (
    <div style={{backgroundColor: `#26e0e5`, color: '#000000'}}>
      Student Account
    </div>
  );

  // Defining the student card footer
  const cardFooter = (
    <React.Fragment>
      <Button className="award-button" label="Revoke XP" icon="pi pi-list" severity="danger" onClick={() => {}} />
      <Button className="award-button" label="Award XP" icon="pi pi-book" severity="success" onClick={() => {}} />
    </React.Fragment>
  );

  // Function to create the student card content
  const cardContent = (student: CoreStudentAccountDetails, index: number) => {
    // Functions to retrieve extra data

    // Returning ard content JSX
    return (
      <Card header={cardHeader} footer={cardFooter} key={index} className='award-xp-grid-item'>
        <div className='content'>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{}</b></div>
            <div className="centerContent"><h2>{`${student.username}`}</h2></div>
            <div className="rightContent"><b>{}</b></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Username:`}</b></div>
            <div className="rightContent">{student.username}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Password:`}</b></div>
            <div className="rightContent">{`----------`}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Snowflake:`}</b></div>
            <div className="rightContent">{student.snowflake}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`School Code:`}</b></div>
            <div className="rightContent">{student.school}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`First Name:`}</b></div>
            <div className="rightContent">{student.firstName}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Surname Initial:`}</b></div>
            <div className="rightContent">{student.surnameInitial}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Token:`}</b></div>
            <div className="rightContent">{``}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent">{student.token}</div>
          </div>
        </div>
      </Card>
    );
  };

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Toast ref={toast}/>
        <h1>Select a student to award or revoke XP to from:</h1>
        <Divider/>
        <div className="award-xp-grid-container">
          {studentData.map((student, index) => cardContent(student, index))}
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

export default AwardRevokeXPDesktop;