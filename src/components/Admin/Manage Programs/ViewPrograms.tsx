// Import core functions
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

// Import CSS
import './ViewPrograms.css'

// Import components
import ProgramCard from './ProgramCard';

// Import functions
import { retrieveProgramData } from '../../../functions/Admin/RetrieveProgramData';
import { deleteProgram } from '../../../functions/Admin/DeleteProgram';

// Import types
import { ProgramData } from '../../../types/Admin/ProgramData';

// Component props interface
interface ViewProgressProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setVisibleForm: (value: boolean) => void;
  programRerender: boolean;
  setProgramRerender: (value: boolean) => void;
  programAdded: boolean;
  setProgramAdded: (value: boolean) => void;
  setVisibleActivities: (value: boolean) => void;
  setSelectedProgram: (value: string) => void;
};

// React function to render the login page for mobile devices
const ViewProgress: React.FC<ViewProgressProps> = ({visible, setVisible, setVisibleForm, programRerender, setProgramRerender, programAdded, setProgramAdded, setVisibleActivities, setSelectedProgram}) => {
  // State variable to store the program data as an array
  const [programData, setProgramData] = useState<ProgramData[]>([]);

  // State variable to log the program selected for deletion
  const [deleteProgramName, setDeleteProgramName] = useState<string>("");

  // State variable to control the visibility of the delete program dialogue box
  const [deleteProgramDialogue, setDeleteProgramDialogue] = useState<boolean>(false);

  // State variable to handel blocking the UI while processes are carried out
  const [blockUI, setBlockUI] = useState<boolean>(false);

  // Flag to control the disabling of all program delate buttons
  const [disableDelete, setDisableDelete] = useState<boolean>(true);

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

  // Function to handel program card click events
  function onProgramCardClick(selectedProgramName: string): void {
    setVisible(false);
    setSelectedProgram(selectedProgramName);
    setVisibleActivities(true);
    return;
  };

  // Function to handel calling the edit program details form
  //TODO Implement this feature
  function onEditClick(name: string, description: string, colour: string): void {
    console.log(name, description, colour);
    toast.current?.show({
      severity: 'error',
      summary: 'Not Implemented Exception',
      detail: `This feature has not been implemented yet. Please come back later.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });
    return;
  };

  // Async function to handel deleting a program
  async function deleteProgramHandler(): Promise<void> {
    setBlockUI(true);
    const success: boolean = await deleteProgram(deleteProgramName);
    if(success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Program Deleted',
        detail: `The program '${deleteProgramName}' has been successfully deleted along with all of it's activities.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    if(!success) {
      toast.current?.show({
        severity: 'error',
        summary: 'Unexpected Error',
        detail: `An unexpected error occurred while trying to delete the program '${deleteProgramName}'. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    setBlockUI(false);
    setDeleteProgramDialogue(false);
    setDeleteProgramName("");
    retrieveProgramDataHandler();
    return;
  };

  // useEffect hook to execute certain functions upton initial page render
  useEffect(() => {
    // Trigger a refresh of the program data when event trigger is fired
    if(programRerender) {
      retrieveProgramDataHandler();
      setProgramRerender(false);
      return;
    };
    if(programAdded) {
      // Output an confirmation message saying the new program has been added to the system
      toast.current?.show({
        severity: 'success',
        summary: 'Program Added',
        detail: `The specified program has been added to the system successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setProgramAdded(false);
    };
  }, [programRerender]); // Pass the 'programRerender' state variable in as a dependency for the hook

  // Function to handel calling the delete program dialogue box
  const onDeleteClick = (name: string) => {
    setDeleteProgramName(name);
    setDeleteProgramDialogue(true);
  };

  // Function to handel resetting the deleteProgram dialogue box
  const hideDeleteProgramDialogue = () => {
    setDeleteProgramDialogue(false);
  };

  // Function to handel pop-up messages upon deletion mode toggle
  const onDeletionModeToggle = () => {
    setDisableDelete((disableDelete) ? false : true);
    if(disableDelete) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Deletion Mode Enabled',
        detail: `Deletion mode has been enabled and so you are now able to delete programs.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    if(!disableDelete) {
      toast.current?.show({
        severity: 'info',
        summary: 'Deletion Mode Disabled',
        detail: `Deletion mode has been disabled and so you are unable to delete programs.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
  };

  // Template to define the footer of the delete multiple activities dialogue box
  const deleteProgramDialogueFooter = (
    <React.Fragment>
      <BlockUI blocked={blockUI}>
        <Button label="No" icon="pi pi-times" severity='secondary' onClick={hideDeleteProgramDialogue} />
        <Button label="Yes" loading={blockUI} icon="pi pi-check" severity="danger" onClick={deleteProgramHandler} />
      </BlockUI>
    </React.Fragment>
  );

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
              onProgramClick={onProgramCardClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              lockDelete={disableDelete}
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

      <div className='view-programs-button'>
        <Button 
          label={(!disableDelete) ? "Disable Delete Mode" : "Enable Delete Mode"}
          icon={(!disableDelete) ? "pi pi-times" : "pi pi-exclamation-triangle"}
          onClick={onDeletionModeToggle} 
          raised 
          severity={(!disableDelete) ? "secondary" : "danger"}/>
      </div>

      <Dialog visible={deleteProgramDialogue} closeIcon='pi pi-times' style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Confirm Deletion of ${deleteProgramName}`} modal footer={deleteProgramDialogueFooter} onHide={hideDeleteProgramDialogue}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <br />
          <span>Are you sure you want to delete the program '{deleteProgramName}'? All activities for this program will also be deleted.</span>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewProgress;
