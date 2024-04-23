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
import ViewActivities from '../../../components/Admin/Manage Programs/ViewActivities';

// React function to render the Admin Portal page for desktop devices
const ManageProgramsDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();

  // Variables to add program data between the view programs page and program details form
  const [formHeader, setFormHeader] = useState<string>("");
  const [formSubheader, setFormSubheader] = useState<string>("");
  const [existingName, setExistingName] = useState<string>("");
  const [existingDescription, setExistingDescription] = useState<string>("");
  const [existingColour, setExistingColour] = useState<string>("");
  const [programSnowflake, setProgramSnowflake] = useState<string>("");
  const [isNew, setIsNew] = useState<boolean>(true);

  // State variables to control the visibility of page components
  const [visiblePrograms, setVisiblePrograms] = useState<boolean>(true);
  const [visibleActivities, setVisibleActivities] = useState<boolean>(false);
  const [visibleProgramForm, setVisibleProgramForm] = useState<boolean>(false);

  // Event trigger state variables
  const [programRerender, setProgramRerender] = useState<boolean>(true);
  const [programAdded, setProgramAdded] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("No Doc");

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
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
          setProgramAdded={setProgramAdded}
          formHeader={formHeader}
          formSubheader={formSubheader}
          existingName={existingName}
          existingDescription={existingDescription}
          existingColour={existingColour}
          programSnowflake={programSnowflake}
          isNew={isNew}
        />
        <ViewProgress
          visible={visiblePrograms}
          setVisible={setVisiblePrograms}
          setVisibleForm={setVisibleProgramForm}
          programRerender={programRerender}
          setProgramRerender={setProgramRerender}
          programAdded={programAdded}
          setProgramAdded={setProgramAdded}
          setVisibleActivities={setVisibleActivities}
          setSelectedProgram={setSelectedProgram}
          setSelectedProgramSnowflake={setProgramSnowflake}
          setFormHeader={setFormHeader}
          setFormSubheader={setFormSubheader}
          setExistingName={setExistingName}
          setExistingDescription={setExistingDescription}
          setExistingColour={setExistingColour}
          setIsNew={setIsNew}
        />
        <ViewActivities
          programName={selectedProgram}
          snowflake={programSnowflake}
          visible={visibleActivities}
          setVisible={setVisibleActivities}
          setProgramsVisible={setVisiblePrograms}
        />
        <div className='manage-programs-buttons'>
          <Button label="Back to Portal" icon="pi pi-arrow-left" onClick={() => {
            window.location.href = `/adminportal/${params.snowflake}/${params.token}/${params.name}`;
          }} raised severity="warning"/>
        </div>
        <Divider />
        <Button label="[DEV] Back" icon="pi pi-arrow-left" onClick={() => {
          window.location.href = `/home` //! DEV button to return to login page - remove later
        }} severity="help"/>
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
