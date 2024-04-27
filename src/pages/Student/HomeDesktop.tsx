// Import core UI components
import { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

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
import { Carousel } from 'primereact/carousel';

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';

// React function to render the Student Portal page for desktop devices
const HomeDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variable to control the visibility of the activities dialogue box
  const [visibleActivities, setVisibleActivities] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("students", params.snowflake, params.token);
      if (confirmed) { setIsLoggedIn(true); return; }
      window.location.href = `/home`;
      return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <h1>Welcome {params.name}</h1>
        {
          /* 
            TODO Put the student program cards on a Carousel when generated from an array
          */
        }
        <StudentProgram
          image='/assets/placeholder.png'
          title='[Program Title]'
          description='[Program Description]'
          progress={{
            programName: '',
            dateStarted: '27/04/2024 - 01:38',
            currentLevel: 5,
            previousTargetXP: 500,
            currentXP: 587,
            targetXP: 600,
            completedActivities: [],
          }}
          setVisibleActivities={setVisibleActivities}
        />
        <StudentActivitiesDialogue
          title='[Dialogue Box Title Placeholder]'
          activities={[
            {
              id: 1,
              description: 'Test Activity 1',
              xpValue: 10,
              dateAdded: "27/04/2024",
              difficulty: "Easy",
            },
            {
              id: 2,
              description: 'Test Activity 2',
              xpValue: 20,
              dateAdded: "27/04/2024",
              difficulty: "Medium",
            },
            {
              id: 3,
              description: 'Test Activity 3',
              xpValue: 30,
              dateAdded: "27/04/2024",
              difficulty: "Hard",
            },
            {
              id: 4,
              description: 'Test Activity 4',
              xpValue: 40,
              dateAdded: "27/04/2024",
              difficulty: "Very Hard",
            },
          ]}
          visible={visibleActivities}
          setVisible={setVisibleActivities}
        />
        <Divider />
        <h2>My Journey</h2>
        <Journey level={5} experience={10} badges={3}></Journey>
        <Divider />
        <h2>My Badges</h2>
        <Badge title="Badge 1" description="This badge is awarded for xyz" iconURL="/assets/placeholder-badges/pink.jpg"></Badge>
        <Badge title="Badge 2" description="This badge is awarded for xyz" iconURL="/assets/placeholder-badges/blue.jpg"></Badge>
        <Badge title="Badge 3" description="This badge is awarded for xyz" iconURL="/assets/placeholder-badges/purple.jpg"></Badge>
        <p><u>Load more badges</u> (to be added)</p>
        <Divider/>
        <h2>New section etc.</h2>
        <Divider/>
        <Button label="Sign-Out" icon="pi pi-sign-out" onClick={() => {
          window.location.href = `/home`
        }} severity="danger"/>
      </>
    );
  } else {
    return (
      <>
        <ProgressSpinner/>
      </>
    );
  };
};

export default HomeDesktop;