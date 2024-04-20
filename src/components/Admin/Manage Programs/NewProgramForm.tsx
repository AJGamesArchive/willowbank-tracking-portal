// Import core functions
import { useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

// Import CSS
import './NewProgramForm.css';

// Import functions
import { addProgram } from '../../../functions/Admin/AddProgram';
import { retrieveDocumentIDs } from '../../../functions/Global/RetrieveDocumentIDs';

// Interface to define props for the new program form
interface NewProgramFormProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setVisiblePrograms: (value: boolean) => void;
  setProgramRerender: (value: boolean) => void;
  setProgramAdded:(value: boolean) => void;
};

// React function to render the login page for mobile devices
const NewProgramForm: React.FC<NewProgramFormProps> = ({visible, setVisible, setVisiblePrograms, setProgramRerender, setProgramAdded}) => {
  // State variables to store form input data
  const [programName, setProgramName] = useState<string>("");
  const [programDescription, setProgramDescription] = useState<string>("");
  const [programColour, setProgramColour] = useState<string>("");

  // State variables to store additional CSS styling for form components
  const [programNameStyle, setProgramNameStyle] = useState<string>("");
  const [programDescriptionStyle, setProgramDescriptionStyle] = useState<string>("");
  const [programColourStyle, setProgramColourStyle] = useState<string>("");

  // State variables to handel the loading state of form buttons
  const [loadingAddProgramButton, setLoadingAddProgramButton] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function to handel the adding of programs to the system
  async function addProgramHandler(): Promise<void> {
    setLoadingAddProgramButton(true);
    setProgramNameStyle("");
    setProgramDescriptionStyle("");
    setProgramColourStyle("");
    // Guard statements to ensure program data has been entered
    const invalidData = (field: string) => {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Program Data',
        detail: `You have not entered a '${field}' for the new program. Please fill in this data and try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    if(programName === "") {
      invalidData("name");
      setProgramNameStyle("p-invalid");
      setLoadingAddProgramButton(false);
      return;
    };
    if(programDescription === "") {
      invalidData("description");
      setProgramDescriptionStyle("p-invalid");
      setLoadingAddProgramButton(false);
      return;
    };
    if(programColour === "") {
      invalidData("colour");
      setProgramColourStyle("p-invalid");
      setLoadingAddProgramButton(false);
      return;
    };
    // Ensure the entered program name is unique
    const existingPrograms = await retrieveDocumentIDs("programs");
    if(typeof existingPrograms === "string") {
      // Output an error message for the existing programs could not be retrieved
      toast.current?.show({
        severity: 'error',
        summary: 'An Unexpected Error Occurred',
        detail: `An unexpected error occurred while trying to validate the entered program name. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setLoadingAddProgramButton(false);
      return;
    };
    let unique: boolean = true;
    existingPrograms.forEach((p) => {
      if(p === programName.toUpperCase()) {
        // Output a warning for the program name is not unique
        toast.current?.show({
          severity: 'warn',
          summary: 'Invalid Program Name',
          detail: `The entered program already exists. Please entered a new program and try again.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setLoadingAddProgramButton(false);
        setProgramNameStyle("p-invalid");
        unique = false;
      };
    });
    if(!unique) {
      return;
    };
    // Attempted to add the entered program data to the system
    const successful: boolean = await addProgram(programName, programDescription, programColour);
    if(!successful) {
      // Output an error message for the program failing to add to the system
      toast.current?.show({
        severity: 'error',
        summary: 'An Unexpected Error Occurred',
        detail: `An unexpected error occurred while trying to add a new program to the system. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setLoadingAddProgramButton(false);
      return;
    };
    // Close form and return to program overviews
    setProgramName("");
    setProgramDescription("");
    setProgramColour("");
    setLoadingAddProgramButton(false);
    setProgramRerender(true);
    setProgramAdded(true);
    setVisible(false);
    setVisiblePrograms(true);
    return;
  };

  // Arrow function to handel the input validation for hex colour codes using reges expressions
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase().slice(0, 7); // Limit input to 7 characters
    if (/^#[0-9A-F]{0,6}$/i.test(inputValue) || inputValue === '#') {
      setProgramColour(inputValue);
    };
  };

  // Return JSX
  return (
    <Card title={`Add New Program`} subTitle='Enter the details of the new program:' style={{ display: visible ? 'block' : 'none' }}>
      <Toast ref={toast}/>
      <div className="p-inputgroup flex-1">
        <span className="p-float-label">
          <InputText
            id="program-name"
            value={programName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramName(e.target.value)}
            required
            className={programNameStyle}
            aria-describedby='program-name-help'
          />
          <label htmlFor="program-name">Program Name</label>
        </span>
      </div>
      <small id="program-name-help" className='add-program-form-help-text'>
        Enter the name of the new program of study.
      </small>

      <div className="add-program-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="program-description"
              value={programDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramDescription(e.target.value)}
              required
              className={programDescriptionStyle}
              aria-describedby='program-description-help'
            />
            <label htmlFor="program-description">Program Description</label>
          </span>
        </div>
        <small id="program-description-help" className='add-program-form-help-text'>
          Enter a brief description of the new program of study.
        </small>
      </div>
      
      <div className="add-program-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            {
              /*
                TODO Maybe update this form field to use the colour picker component
              */
            }
            <InputText
              id="program-colour"
              value={programColour}
              onChange={handleHexInput}
              placeholder='#000000'
              required
              className={programColourStyle}
              aria-describedby='program-colour-help'
            />
            <label htmlFor="program-colour">Program Colour</label>
          </span>
        </div>
        <small id="program-description-help" className='add-program-form-help-text'>
          Enter the hex colour you want this programs badges to be.
        </small>
      </div>

      <div className="add-program-form-button-field">
        <div className="add-program-form-button">
          <Button label="Add Program" icon="pi pi-plus" loading={loadingAddProgramButton} onClick={() => {
            addProgramHandler();
          }} raised severity="info"/>
        </div>
        <div className="add-program-form-button">
          <Button label="Help" icon="pi pi-question-circle" onClick={() => {
            console.log("Help!");
            //TODO Implement help information for what hex code colours are and how to get them.
          }} raised severity="help"/>
        </div>
        <div className="add-program-form-button">
          <Button label="Cancel" icon="pi pi-times" onClick={() => {
            setVisible(false);
            setVisiblePrograms(true);
            setProgramRerender(true);
          }} raised severity="secondary"/>
        </div>
      </div>

    </Card>
  );
};

export default NewProgramForm;
