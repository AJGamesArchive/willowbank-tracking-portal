// Import core UI components
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';

// Import global parameters
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './HomeDesktop.css';
import './HomeGlobal.css';

// Import UI components
import Badge from '../../components/StudentHome/Badge';
import Journey from '../../components/StudentHome/Journey';
import StudentProgram from '../../components/StudentHome/StudentPrograms';
import StudentActivitiesDialogue from '../../components/StudentHome/StudentActivities';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';
import { retrieveProgramData } from '../../functions/Admin/ManagePrograms/RetrieveProgramData';
import { retrieveDocumentIDs } from '../../functions/Global/RetrieveDocumentIDs';
import { retrieveXPData } from '../../functions/Student/RetrieveXPData';
import { retrieveStudentData } from '../../functions/Student/RetrieveStudentData';
import { retrieveAllActivities } from '../../functions/Admin/ManagePrograms/RetrieveActivityData';

// Importing types
import { XPStudentAccountDetails } from '../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../types/Global/UserAccountDetails';
import { ProgramData } from '../../types/Admin/ProgramData';
import { AssessedActivities } from '../../types/Student/AssessedActivities';
import { BadgeData } from '../../types/Global/Bdges';

// React function to render the Student Portal page for desktop devices
const HomeDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // State variables to store student data and program progress data
  const [coreProgramData, setCoreProgramData] = useState<ProgramData[]>([]);
  const [programActivities, setProgramActivities] = useState<AssessedActivities[]>([]);
  const [coreStudentData, setCoreStudentData] = useState<CoreStudentAccountDetails>();
  const [progress, setProgress] = useState<XPStudentAccountDetails[]>([]);

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable to control the visibility of the activities dialogue box
  const [visibleActivities, setVisibleActivities] = useState<boolean>(false);

  // State variable to block UI while processes are running
  const [blockUI, setBlockUI] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function to retrieve all activities for a given program and mark complete activities as completed when the activity dialogue box is called
  async function fetchAndFilterActivities(snowflake: string, programName: string): Promise<void> {
    setBlockUI(true);
    const activities = await retrieveAllActivities(snowflake);
    if(typeof activities == "string") {
      toast.current?.show({
        severity: 'error',
        summary: 'Unexpected Error',
        detail: `An unexpected error occurred while trying to retrieve activity data for this program. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setBlockUI(false); return;
    };
    let assessed: AssessedActivities[] = [];
    let programIndex: number = -1;
    for(let i = 0; i < progress.length; i++) {
      if(progress[i].programName.toLocaleLowerCase() === programName.toLocaleLowerCase()) {
        programIndex = i;
      };
    };
    activities.forEach((a) => {
      let completed: boolean = false;
      try {
        progress[programIndex].completedActivities.forEach((c) => {
          if(a.id === c.id) {
            completed = true;
          };
        });
      } catch (e) {
        console.log(e);
        toast.current?.show({
          severity: 'error',
          summary: 'Unexpected Error',
          detail: `An unexpected error occurred while trying to assess the activities. Please try again.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setBlockUI(false); return;
      };
      const assessment: AssessedActivities = {
        completed: completed,
        activity: a,
      };
      assessed.push(assessment);
    });
    setProgramActivities(assessed);
    setVisibleActivities(true);
    setBlockUI(false);
  };

  // Async function to retrieve all student data required for the portal
  async function retrieveStudentDataHandler(): Promise<void> {
    const assignedProgramIDs = await retrieveDocumentIDs("students", params.snowflake, "programs");
    const programData = await retrieveProgramData();
    const programProgress = await retrieveXPData((params.snowflake? params.snowflake : ''));
    const studentData = await retrieveStudentData((params.snowflake? params.snowflake : ''));
    if(typeof assignedProgramIDs === "string" || typeof programData === "string" || typeof programProgress === "string" || typeof studentData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    let filteredProgramData: ProgramData[] = [];
    if(typeof programData !== "string" && typeof assignedProgramIDs !== "string") {
      programData.forEach((p) => {
        if(assignedProgramIDs.includes(p.snowflake)) filteredProgramData.push(p);
      });
    };
    setCoreProgramData((typeof programData !== "string") ? filteredProgramData : coreProgramData);
    setProgress((typeof programProgress !== "string") ? programProgress : progress);
    setCoreStudentData((typeof studentData !== "string") ? studentData : coreStudentData);
    return;
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("students", params.snowflake, params.token);
      if(!confirmed) {window.location.href = `/home`;}
      await retrieveStudentDataHandler();
      setIsLoggedIn(true);
      return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Const to define break points for how to display and operate the program progress carousel
  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: '9999999px',
      numVisible: 4,
      numScroll: 1
    },
    {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    },
  ];

  // Function to retrieve the description of a program
  const getDescription = (name: string): [string, string, string] => {
    let description: string = '';
    let colour: string = '';
    let snowflake: string = '';
    for (let i = 0; i < coreProgramData.length; i++) {
      if(coreProgramData[i].name.toLowerCase() === name.toLowerCase()) {
        description = coreProgramData[i].description;
        colour = coreProgramData[i].colour;
        snowflake = coreProgramData[i].snowflake;
      };
    };
    return [description, colour, snowflake]
  };

  // Function to create the program progress cards for the program progress carousel
  const programProgressCardTemplate = (program: XPStudentAccountDetails) => {
    const [description, colour, snowflake] = getDescription(program.programName);
    return (
      <React.Fragment>
        <StudentProgram
          programSnowflake={snowflake}
          image='/assets/placeholder.png'
          title={program.programName}
          description={description}
          colour={colour}
          progress={program}
          fetchAndFilterActivities={fetchAndFilterActivities}
          lockButton={blockUI}
        />
      </React.Fragment>
    );
  };

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <BlockUI blocked={blockUI}>
        <Toast ref={toast}/>
        <h1>Welcome {params.name}</h1>
        <div className='program-progress-carousel'>
          <Carousel 
            value={progress}  
            responsiveOptions={responsiveOptions} 
            itemTemplate={programProgressCardTemplate} 
            nextIcon='pi pi-angle-right'
            prevIcon='pi pi-angle-left'
          />
        </div>
        <StudentActivitiesDialogue
          title='Fishing Activities'
          programName='Fishing'
          activities={programActivities}
          visible={visibleActivities}
          setVisible={setVisibleActivities}
        />
        <Divider />
        
        <Button label="Sign-Out" icon="pi pi-sign-out" onClick={() => {
          window.location.href = `/home`
        }} severity="danger"/>
        </BlockUI>
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

export default HomeDesktop;