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
import Banner from '../AdminPortal/Banner';

// Import functions
import { retrieveProgramData } from '../../../functions/Admin/ManagePrograms/RetrieveProgramData';
import { deleteProgram } from '../../../functions/Admin/ManagePrograms/DeleteProgram';

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
  setSelectedProgramSnowflake: (value: string) => void;
  setFormHeader: (value: string) => void;
  setFormSubheader: (value: string) => void;
  setExistingData: (value: ProgramData) => void;
  setIsNew: (value: boolean) => void;
};

// React function to render the login page for mobile devices
const ViewProgress: React.FC<ViewProgressProps> = ({visible, setVisible, setVisibleForm, programRerender, setProgramRerender, programAdded, setProgramAdded, setVisibleActivities, setSelectedProgram, setSelectedProgramSnowflake, setFormHeader, setFormSubheader, setExistingData, setIsNew}) => {
  // State variable to store the program data as an array
  const [programData, setProgramData] = useState<ProgramData[]>([]);

  // State variable to log the program selected for deletion
  const [deleteProgramName, setDeleteProgramName] = useState<string>("");
  const [deleteProgramSnowflake, setDeleteProgramSnowflake] = useState<string>("");

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
  function onProgramCardClick(selectedProgramName: string, snowflake: string): void {
    setVisible(false);
    setSelectedProgram(selectedProgramName);
    setSelectedProgramSnowflake(snowflake);
    setVisibleActivities(true);
    return;
  };

  // Async function to handel deleting a program
  async function deleteProgramHandler(): Promise<void> {
    setBlockUI(true);
    const success: boolean = await deleteProgram(deleteProgramSnowflake);
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
    setDeleteProgramSnowflake("");
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
        summary: 'Program Saved',
        detail: `The specified program has been saved to the system successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setProgramAdded(false);
    };
  }, [programRerender]); // Pass the 'programRerender' state variable in as a dependency for the hook

  // Function to handel opening the program details form for a new program
  const openNewProgramForm = () => {
    setFormHeader('Add New Program');
    setFormSubheader('Enter details for the new program:');
    setExistingData({
      snowflake: '',
      name: '',
      description: '',
      colour: '',
      badgeShape: '',
      badgeTextColor: '',
    });
    setSelectedProgramSnowflake('----------');
    setIsNew(true);
    setVisible(false);
    setVisibleForm(true);
  };

  // Function to handel opening the program details form for an existing program
  const openExistingProgramForm = (data: ProgramData) => {
    setFormHeader('Update Program');
    setFormSubheader(`Update details for the program '${data.name}':`);
    setExistingData(data);
    setIsNew(false);
    setVisible(false);
    setVisibleForm(true);
  };

  // Function to handel calling the delete program dialogue box
  const onDeleteClick = (name: string, snowflake: string) => {
    setDeleteProgramName(name);
    setDeleteProgramSnowflake(snowflake);
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

      <Banner
        backgroundimage='/assets/admin-portal-images/banner.png' 
        text={`Program Management`} 
      />

      <div className='grid-container'>
        {programData.map((item, index) => (
          <div className='grid-item' key={index}>
            <ProgramCard
              data={item}
              onProgramClick={onProgramCardClick}
              onEditClick={openExistingProgramForm}
              onDeleteClick={onDeleteClick}
              lockDelete={disableDelete}
            />
          </div>
        ))}
      </div>

      <div className='view-programs-button'>
        <Button label="Add New Program" icon="pi pi-plus" onClick={openNewProgramForm} raised severity="info"/>
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
