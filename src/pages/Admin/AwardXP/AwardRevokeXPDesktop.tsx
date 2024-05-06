// Import core functions
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast, ToastMessage } from 'primereact/toast';
import { Divider } from 'primereact/divider';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './AwardRevokeXPDesktop.css'

// Import types
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';
import { SchoolSearch } from '../../../types/Login/SchoolSearch';
import { ProgramData } from '../../../types/Admin/ProgramData';

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { getStudentAccountInfo } from '../../../functions/Admin/getstudentAccountInfo';
import { schoolSearcher } from '../../../functions/Login/SchoolSearcher';
import { retrieveProgramData } from '../../../functions/Admin/ManagePrograms/RetrieveProgramData';

// Import UI Components
import ManageXP from '../../../components/Admin/AwardRevokeXP/ManageXP';

// Type declaration for school mappings
type SchoolMapping = {
  code: string;
  name: string;
};

// React function to render the award/revoke xp page for mobile devices
const AwardRevokeXPDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable to store all student data
  const [studentData, setStudentData] = useState<CoreStudentAccountDetails[]>([]);
  const [schoolMappings, setSchoolMappings] = useState<SchoolMapping[]>([]);
  const [programs, setPrograms] = useState<ProgramData[]>([]);

  // State variable to control the visibility and data set of the manage XP dialogue box
  const [visibleDialogue, setVisibleDialogue] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<CoreStudentAccountDetails>({
    snowflake: '',
    username: '',
    firstName: '',
    surnameInitial: '',
    password: '',
    school: '',
    token: '',
    badges: [],
  });

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function t retrieve all student data from the DB
  async function retrieveAllStudents(): Promise<void> {
    // Retrieve all student data
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
    // Map school names to school codes
    let baseSchoolMappings: SchoolMapping[] = [];
    for(let i = 0; i < baseStudentData.length; i++) {
      let added: boolean = false;
      for(let j = 0; j < baseSchoolMappings.length; j++) {
        if(baseStudentData[i].school === baseSchoolMappings[j].code) added = true;
      };
      if(!added) {
        const result: SchoolSearch = await schoolSearcher(baseStudentData[i].school);
        baseSchoolMappings.push({
          code: baseStudentData[i].school,
          name: (!result.errored) ? result.schoolName : '[Cannot Find School]',
        });
      };
    };
    setSchoolMappings(baseSchoolMappings);
    // Retrieve all Program data
    const baseProgramData = await retrieveProgramData();
    if(typeof baseProgramData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };
    setPrograms(baseProgramData);
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

  // Function to create the student card content
  const cardContent = (student: CoreStudentAccountDetails, index: number) => {
    // Defining the student card footer
    const cardFooter = (
      <React.Fragment>
        <Button className="award-button" label="Manage XP" icon="pi pi-pencil" severity="info" onClick={() => {
          setSelectedStudent(student);
          setVisibleDialogue(true);
        }} />
      </React.Fragment>
    );

    // Functions to retrieve extra data
    let schoolName: string = '[Cannot Find School]';
    for(let i = 0; i < schoolMappings.length; i++) {
      if(student.school === schoolMappings[i].code) schoolName = schoolMappings[i].name;
    };
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
            <div className="leftContent"><b>{`School Name:`}</b></div>
            <div className="rightContent">{String(schoolName)}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`First Name:`}</b></div>
            <div className="rightContent">{student.firstName}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Surname Initial:`}</b></div>
            <div className="rightContent">{student.surnameInitial}</div>
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
        <ManageXP
          visible={visibleDialogue}
          setVisible={setVisibleDialogue}
          student={selectedStudent}
          programs={programs}
          toastCallBack={async (message: ToastMessage) => {
            toast?.current?.show(message);
            return;
          }}
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

export default AwardRevokeXPDesktop;