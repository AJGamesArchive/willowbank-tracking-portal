// Import core functions
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';

// Import CSS
import './ManageProgramsDesktop.css'
import './ManageProgramsGlobal.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { Divider } from 'primereact/divider';

// Import components
import ViewProgress from '../../../components/Admin/Manage Programs/ViewPrograms';
import NewProgramForm from '../../../components/Admin/Manage Programs/NewProgramForm';

// React function to render the Admin Portal page for desktop devices
const ManageProgramsDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // State variables to control the visibility of page components
  const [visiblePrograms, setVisiblePrograms] = useState<boolean>(true);
  const [visibleProgramForm, setVisibleProgramForm] = useState<boolean>(false);

  // Event trigger state variable
  const [programRerender, setProgramRerender] = useState<boolean>(false);

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.username, params.token);
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
        <NewProgramForm
          visible={visibleProgramForm}
          setVisible={setVisibleProgramForm}
          setVisiblePrograms={setVisiblePrograms}
          setProgramRerender={setProgramRerender}
        />
        <ViewProgress
          visible={visiblePrograms}
          setVisible={setVisiblePrograms}
          setVisibleForm={setVisibleProgramForm}
          programRerender={programRerender}
          setProgramRerender={setProgramRerender}
        />
        <Divider />
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

export default ManageProgramsDesktop;
