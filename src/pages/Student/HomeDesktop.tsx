// Import core UI components
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { Divider } from 'primereact/divider';

// Import global parameters
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './HomeDesktop.css';
import './HomeGlobal.css';
import '../Shared CSS files/PortalDesktop.css'

// Import UI components
import Badge from '../../components/StudentHome/Badge';
import StudentProgram from '../../components/StudentHome/StudentPrograms';
import StudentActivitiesDialogue from '../../components/StudentHome/StudentActivities';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import EditAccountDetails from '../../components/Global/EditAccountDetails';
import SignOutOption from '../../components/Admin/AdminPortal/AdminMenuSignOutOption';
import ModifyOption from '../../components/Admin/AdminPortal/AdminMenuOptionChangeDetails';
import MenuOption from '../../components/Admin/AdminPortal/AdminMenuOption';
import DisplaySchoolData from '../../components/StudentHome/StudentSchoolData';
import Banner from '../../components/Admin/AdminPortal/Banner';

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';
import { retrieveProgramData } from '../../functions/Admin/ManagePrograms/RetrieveProgramData';
import { retrieveDocumentIDs } from '../../functions/Global/RetrieveDocumentIDs';
import { retrieveXPData } from '../../functions/Student/RetrieveXPData';
import { retrieveStudentData } from '../../functions/Student/RetrieveStudentData';
import { retrieveAllActivities } from '../../functions/Admin/ManagePrograms/RetrieveActivityData';
import { createActivityCompleteRequest } from '../../functions/Student/CreateActivityCompleteRequest';
import { getSchoolName } from '../../functions/Student/GetSchoolName';
import { RetrieveSchoolData } from '../../functions/Global/RetrieveSchoolData';

// Importing types
import { XPStudentAccountDetails } from '../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../types/Global/UserAccountDetails';
import { ProgramData } from '../../types/Admin/ProgramData';
import { AssessedActivities } from '../../types/Student/AssessedActivities';
import { Activity } from '../../types/Global/Activity';
import { BadgeData } from '../../types/Global/Badges';
import { CoreSchoolDetails } from '../../types/Schools/CoreSchoolDetails';

// React function to render the Student Portal page for desktop devices
const HomeDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // State variables to store student data and program progress data
  const [coreProgramData, setCoreProgramData] = useState<ProgramData[]>([]);
  const [programActivities, setProgramActivities] = useState<AssessedActivities[]>([]);
  const [coreStudentData, setCoreStudentData] = useState<CoreStudentAccountDetails>();
  const [coreSchoolData, setCoreSchoolData] = useState<CoreSchoolDetails>();
  const [recentBadges, setRecentBadges] = useState<BadgeData[]>([]);
  const [progress, setProgress] = useState<XPStudentAccountDetails[]>([]);
  const [selectedProgram, setSelectProgram] = useState<string>("");
  const [selectedProgramName, setSelectedProgramName] = useState<string>("");

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variables to control the visibility of portal dialogue boxes
  const [visibleActivities, setVisibleActivities] = useState<boolean>(false);
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false);

  // State variable to block UI while processes are running
  const [blockUI, setBlockUI] = useState<boolean>(false);

  // State variable to control the account details updated confirmation message
  const [detailConfirmation, setDetailConfirmation] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Display the users name in a normal casing format
  const name : string = String(params.name?.charAt(0).toUpperCase()) + String(params.name?.substring(1).toLowerCase());

  // Async function to retrieve all activities for a given program and mark complete activities as completed when the activity dialogue box is called
  async function fetchAndFilterActivities(snowflake: string, programName: string): Promise<void> {
    setBlockUI(true);
    setSelectProgram(snowflake);
    setSelectedProgramName(programName);
    const activities = await retrieveAllActivities(snowflake);
    const updatedProgress = await retrieveXPData((params.snowflake? params.snowflake : ''));
    if(typeof activities == "string" || typeof updatedProgress === "string") {
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
      if(updatedProgress[i].programName.toLocaleLowerCase() === programName.toLocaleLowerCase()) {
        programIndex = i;
      };
    };
    activities.forEach((a) => {
      let completed: boolean = false;
      let pending: boolean= false;
      let date: string = '-----';
      try {
        updatedProgress[programIndex].completedActivities.forEach((c) => {
          if(a.id === c.id) {
            completed = true;
            date = c.dateCompleted;
          };
        });
        updatedProgress[programIndex].pendingActivities.forEach((p) => {
          if(a.id === p.id) {
            pending = true;
            date = p.dateSubmitted;
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
        pending: pending,
        activity: a,
        date: date,
      };
      assessed.push(assessment);
    });
    setProgramActivities(assessed);
    setVisibleActivities(true);
    setBlockUI(false);
    return;
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

    const schoolData = await RetrieveSchoolData((typeof studentData !== "string" ? studentData.school : ''));

    if(typeof schoolData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    }


    let filteredProgramData: ProgramData[] = [];
    if(typeof programData !== "string" && typeof assignedProgramIDs !== "string") {
      programData.forEach((p) => {
        if(assignedProgramIDs.includes(p.snowflake)) filteredProgramData.push(p);
      });
    };
    let retrieveRecentBadges: BadgeData[] = [];
    const totalBadges: number = (typeof studentData !== "string") ? studentData.badges.length - 1 : -1;
    for(let i = (typeof studentData !== "string") ? (studentData.badges.length - 1) : -1; i > totalBadges - 10; i--) {
      if(i === -1) break;
      retrieveRecentBadges.push((typeof studentData !== "string") ? studentData.badges[i] : {
        snowflake: '',
        shape: 'Square',
        colour: 'ffffff',
        textColour: 'Black',
        level: 0,
        awardedProgram: '',
        programSnowflake: '',
        awardedFor: '',
        dateAwarded: 'DD/MM/YYYY-HH/MM'
      });
    };
    setCoreProgramData((typeof programData !== "string") ? filteredProgramData : coreProgramData);
    setProgress((typeof programProgress !== "string") ? programProgress : progress);
    setCoreStudentData((typeof studentData !== "string") ? studentData : coreStudentData);
    setCoreSchoolData((typeof schoolData !== "string") ? schoolData : coreSchoolData );
    setRecentBadges(retrieveRecentBadges);
  };

  // Async function to handel creating activity complete requests
  async function createActivityCompleteRequestHandler(activityId: number): Promise<void> {
    setVisibleActivities(false);
    const UnexpectedCreationError = () => {
      toast.current?.show({
        severity: 'error',
        summary: 'Unexpected Error',
        detail: `An unexpected error occurred while try to submit an activity for completion review. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    const studentName: string = `${coreStudentData?.firstName} ${coreStudentData?.surnameInitial}`;
    let programName: string = '[Error]';
    coreProgramData.forEach((p) => {
      if(p.snowflake === selectedProgram) programName = p.name;
    });
    let activity: Activity | undefined = undefined;
    programActivities.forEach((a) => {
      if(a.activity.id === activityId) activity = a.activity;
    });
    if(activity === undefined) {UnexpectedCreationError(); return;};
    const schoolName = await getSchoolName((coreStudentData) ? coreStudentData.school : '');
    if(schoolName === undefined) {UnexpectedCreationError(); return;};
    const success: boolean = await createActivityCompleteRequest((coreStudentData) ? coreStudentData.snowflake : '', studentName, selectedProgram, programName, activity, schoolName);
    if(!success) {UnexpectedCreationError(); return;}
    toast.current?.show({
      severity: 'success',
      summary: 'Request Submitted',
      detail: `Activity ${activityId} has been submitted for admin review. Once approved, you will be awarded the XP from the activity.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });
    return;
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("students", params.snowflake, params.token);
      if(!confirmed) {window.location.href = `/home`; return;}
      await retrieveStudentDataHandler();
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
        breakpoint: '1103px',
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
  const getDescription = (name: string): [string, string, string, string] => {
    let description: string = '';
    let colour: string = '';
    let snowflake: string = '';
    let textColour: string = "";
    for (let i = 0; i < coreProgramData.length; i++) {
      if(coreProgramData[i].name.toLowerCase() === name.toLowerCase()) {
        description = coreProgramData[i].description;
        colour = coreProgramData[i].colour;
        snowflake = coreProgramData[i].snowflake;
        textColour = coreProgramData[i].badgeTextColor;
      };
    };
    return [description, colour, snowflake, textColour]
  };

  // Function to create the program progress cards for the program progress carousel
  const programProgressCardTemplate = (program: XPStudentAccountDetails) => {
    let locked = false;
    const [description, colour, snowflake, textColour] = getDescription(program.programName);
    if(!description && !colour && !snowflake && !textColour) locked = true;
    return (
      <React.Fragment>
        <StudentProgram
          programSnowflake={snowflake}
          image='/assets/placeholder.png'
          title={program.programName}
          description={description}
          colour={colour}
          textColour={textColour}
          progress={program}
          fetchAndFilterActivities={fetchAndFilterActivities}
          lockButton={blockUI}
          locked={locked}
          badgeFilterPath={`/student/viewbadges/${params.snowflake}/${params.token}/${params.name}/p/${program.programName.replace(/ /g, '-')}`}
        />
      </React.Fragment>
    );
  };

  // Function to define the recent badges card template
  const recentBadgesCardTemplate = (badge: BadgeData) => {
    return (
      <React.Fragment>
        <Badge
          badge={badge}
          id={0}
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
          <Banner 
            backgroundimage='/assets/teacher-portal-images/teacher-banner.png' 
            text={`Welcome ${name}`}
          />
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
            title={`${selectedProgramName} Activities`}
            programName={selectedProgramName}
            activities={programActivities}
            visible={visibleActivities}
            setVisible={setVisibleActivities}
            onActivityClick={createActivityCompleteRequestHandler}
          />
          <EditAccountDetails
            accountType='students'
            snowflake={(coreStudentData) ? coreStudentData.snowflake : ''}
            token={(params.token) ? params.token : ''}
            existingFirstName={(coreStudentData) ? coreStudentData.firstName : ''}
            existingSurnameI={(coreStudentData) ? coreStudentData.surnameInitial : ''}
            existingUsername={(coreStudentData) ? coreStudentData.username : ''}
            existingPassword={(coreStudentData) ? coreStudentData.password : ''}
            visible={visibleSettings}
            setVisible={setVisibleSettings}
            setIsLoggedIn={setIsLoggedIn}
            setDetailConfirmation={setDetailConfirmation}
          />
          <Divider />
          <h1>Most Recent Badges</h1>
          <div className='program-progress-carousel'>
            <Carousel 
              value={recentBadges}  
              responsiveOptions={responsiveOptions} 
              itemTemplate={recentBadgesCardTemplate} 
              nextIcon='pi pi-angle-right'
              prevIcon='pi pi-angle-left'
            />
          </div>
          <Divider />
            <DisplaySchoolData
              schoolName={coreSchoolData?.name ? coreSchoolData.name : " "}
              timetable={coreSchoolData?.times ? coreSchoolData.times : []}
            />
          <Divider />
          <li className="listItem">
            <MenuOption 
                title={"View All Badges"}
                destinationPage={`/student/viewbadges/${params.snowflake}/${params.token}/${params.name}/a/n`}
                imageSRC='/assets/student-portal-images/badge.png'
                imageAltText='badges-banner'
            />
          </li>
          <li className="listItem">
              <div onClick={() => setVisibleSettings(true)}>
                <ModifyOption
                  imageSRC={`/assets/admin-portal-images/Settings.png`}
                  imageAltText='Settings image'
                  title="Account details" />
              </div>
            </li>
          <li className="listItem">
            <SignOutOption />
          </li>
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