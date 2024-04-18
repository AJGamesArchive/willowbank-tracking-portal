// Import core functions
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

// Import core UI components
// ---

// Import UI components
import Badge from '../../components/StudentHome/Badge';
import Journey from '../../components/StudentHome/Journey';

// Import functions
import { confirmLogin } from '../../functions/Global/ConfirmLogin';

// React function to render the Student Portal page for desktop devices
const HomeDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("students", params.username, params.token);
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
        <h1>Welcome {params.username}</h1>
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
        <Button label="[DEV] Back" icon="pi pi-arrow-left" onClick={() => {
          window.location.href = `/home` //! DEV button to return to login page - remove later
        }} severity="secondary"/>
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