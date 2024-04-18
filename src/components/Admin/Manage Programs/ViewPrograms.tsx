// Import core functions
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

// Import CSS
import './ViewPrograms.css'

// Import components
import ProgramCard from './ProgramCard';

// Import functions
import { retrieveProgramData } from '../../../functions/Admin/RetrieveProgramData';

// Import types
import { ProgramData } from '../../../types/Admin/ProgramData';

// Component props interface
interface ViewProgressProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setVisibleForm: (value: boolean) => void;
  programRerender: boolean;
  setProgramRerender: (value: boolean) => void;
};

// React function to render the login page for mobile devices
const ViewProgress: React.FC<ViewProgressProps> = ({visible, setVisible, setVisibleForm, programRerender, setProgramRerender}) => {
  // State variable to store the program data as an array
  const [programData, setProgramData] = useState<ProgramData[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function to handel the retrieval of program data from the database
  async function retrieveProgramDataHandler(): Promise<void> {
    const documents = await retrieveProgramData();
    if(typeof documents === "string") {
      // Output an error message for error retrieving program data
      toast.current?.show({
        severity: 'error',
        summary: 'An Unexpected Error Occurred',
        detail: `An unexpected error occurred while trying to load existing program data. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };
    setProgramData(documents);
    return;
  };

  // Trigger a refresh of the program data when event trigger is fired
  if(programRerender) {
    retrieveProgramDataHandler();
    setProgramRerender(false);
    return;
  };

  // useEffect hook to execute certain functions upton initial page render
  useEffect(() => {
    retrieveProgramDataHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Return JSX
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Toast ref={toast}/>

      <h1>Program Management</h1>

      <div className='grid-container'>
        {programData.map((item, index) => (
          <div className='grid-item' key={index}>
            <ProgramCard
              name={item.name}
              description={item.description}
              colour={item.colour}
            />
          </div>
        ))}
      </div>

      <div className='view-programs-button'>
        <Button label="Add New Program" icon="pi pi-plus" onClick={() => {
          setVisible(false);
          setVisibleForm(true);
        }} raised severity="info"/>
      </div>
    </div>
  );
};

export default ViewProgress;