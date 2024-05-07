// Import core functions
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { Toast } from 'primereact/toast';

// Import CSS
import './ViewTimetablesMobile.css';
import './ViewTimetablesDesktop.css';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

//Import Types
import { AllSchoolDetails } from '../../../types/Admin/AllSchoolDetails';

//Import Functions
import { getAllSchools } from '../../../functions/Admin/View Schools/GetAllSchools';

//Import Components
import TimetableLayout from '../../../components/Admin/View Timetables/TimetableLayout';

const ViewTimetablesDesktop: React.FC = () => {
    // Setting up global params on this page
    const params = useParams<GlobalParams>();

    const [allSchools, setAllSchools] = useState<AllSchoolDetails[]>([]);
  
    // Variable to force confirmation of the account login state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Variables to control toast messages
    const toast = useRef<Toast>(null);

    async function retrieveTimetablesHandler(): Promise<void> {
        const getSchools: string | AllSchoolDetails[] = await getAllSchools();

        if(typeof getSchools === "string") {
            toast.current?.show({
              severity: 'warn',
              summary: 'Missing Data',
              detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
              closeIcon: 'pi pi-times',
              life: 7000,
            });
        }

        setAllSchools((typeof getSchools !== "string") ? getSchools : allSchools);
        return;
    }   
  
    // Event handler to perform action upon initial render
    useEffect(() => {
      async function confirmLoginHandler() {
        const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
        if (!confirmed) { window.location.href = `/home`; return; }
        await retrieveTimetablesHandler();
        setIsLoggedIn(true);
        return;
      };
      confirmLoginHandler();
    }, []); // Emptying process array to ensure handler only runs on initial render
  
    // Return JSX based on login state
    if (isLoggedIn) {
      return (
        <>
            {allSchools.map((school, index) => (
                <div>
                    <TimetableLayout
                        schoolName={school.schoolName}
                        schoolCode={school.schoolCode}
                        schoolEmail={school.schoolEmail}
                        schoolPhone={school.schoolPhone}
                        index={index}
                        timetable={school.timetable}
                    />
                </div>
            ))}
        </>
      );
    } 
    else {
      return (
        <>
          <ProgressSpinner/>
        </>
      );
    };
};
  
export default ViewTimetablesDesktop