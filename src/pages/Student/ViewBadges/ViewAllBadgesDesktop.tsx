// Import core UI components
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

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
      const confirmed: boolean = await confirmLogin("students", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; }
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
      setBadges(studentData.badges);
      setFilteredBadges(studentData.badges);
      setIsLoggedIn(true); return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Toast ref={toast}/>
        <h1>Fuck Badges!</h1>
        <div className="badge-grid-container">
          {filteredBadges.map((badge, index) => (
            <div className='badge-grid-item'>
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