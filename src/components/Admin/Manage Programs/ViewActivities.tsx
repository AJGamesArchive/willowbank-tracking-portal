// Import core functions
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

// Import CSS
import './ViewActivities.css';

interface ViewActivitiesProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setProgramsVisible: (value: boolean) => void;
  programName: string;
};

// React function to render the view activities components
const ViewActivities: React.FC<ViewActivitiesProps> = ({visible, setVisible, setProgramsVisible, programName}) => {
  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Return JSX
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Toast ref={toast}/>
      <h1>View Activities:</h1>
      <h1>{programName}</h1>
      <div className='activity-buttons'>
        <Button label="Back to Programs" icon="pi pi-arrow-left" onClick={() => {
          setVisible(false);
          setProgramsVisible(true);
        }} raised severity="secondary"/>
      </div>
    </div>
  );
};

export default ViewActivities;
