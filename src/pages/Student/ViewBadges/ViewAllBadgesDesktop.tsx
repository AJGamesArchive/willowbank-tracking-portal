// Import core UI components
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { CustomRenderProps, MeterGroup } from 'primereact/metergroup';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

// Import UI components
import Badge from '../../../components/StudentHome/Badge';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './ViewAllBadgesDesktop.css'
import './ViewAllBadgesGlobal.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { retrieveStudentData } from '../../../functions/Student/RetrieveStudentData';

// Import types
import { BadgeData } from '../../../types/Global/Badges';

// Defining the data type for counting program occurrences
type CountingPrograms = {
  programName: string;
  programColour: string;
  counter: number;
  percentage: number;
};

// React function to render the view all badges page for desktop devices
const ViewBadgesDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variables to store badges
  const [allBadges, setBadges] = useState<BadgeData[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<BadgeData[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      // Validate login
      const confirmed: boolean = await confirmLogin("students", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; }

      // Retrieve all student and badge data
      const studentData = await retrieveStudentData((params.snowflake? params.snowflake : ''));
      if(typeof studentData === "string") {
        toast.current?.show({
          severity: 'warn',
          summary: 'Missing Data',
          detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setIsLoggedIn(true); return;
      };

      // Save badge data
      setBadges(studentData.badges);
      setFilteredBadges(studentData.badges);

      //* Calculating data to power meter group
      // Calculate badges as percentages of programs
      let countPrograms: CountingPrograms[] = [];
      studentData.badges.forEach((b) => {
        let logged: boolean = false;
        countPrograms.forEach((p) => {
          if(p.programName === b.awardedProgram) {
            logged = true;
            p.counter++;
          };
        });
        if(!logged) {
          countPrograms.push({
            programName: b.awardedProgram,
            programColour: b.colour,
            counter: 1,
            percentage: 0,
          });
        };
      });
      setIsLoggedIn(true); return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Toast ref={toast}/>
        <h1>Here's all your awarded badges {params.name}!</h1>
        <Divider/>
        <div className="student-badge-grid-container">
          {filteredBadges.map((badge, index) => (
            <div className='student-badge-grid-item'>
              <Badge
                badge={badge}
                id={index}
              />
            </div>
          ))}
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

export default ViewBadgesDesktop;