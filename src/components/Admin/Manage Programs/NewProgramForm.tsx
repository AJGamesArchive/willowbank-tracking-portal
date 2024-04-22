// Import core functions
import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import { BlockUI } from 'primereact/blockui';

// Import CSS
import './NewProgramForm.css';

// Import functions
import { saveProgram } from '../../../functions/Admin/ManagePrograms/SaveProgram';
import { classNames } from 'primereact/utils';
import { isUniqueProgramName } from '../../../functions/Validation/IsUniqueProgramName';

// Interface to define props for the new program form
interface NewProgramFormProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setVisiblePrograms: (value: boolean) => void;
  setProgramRerender: (value: boolean) => void;
  setProgramAdded:(value: boolean) => void;
  formHeader: string;
  formSubheader: string;
  existingName: string;
  existingDescription: string;
  existingColour: string;
  programSnowflake: string;
  isNew: boolean;
};

// React function to render the login page for mobile devices
const NewProgramForm: React.FC<NewProgramFormProps> = ({visible, setVisible, setVisiblePrograms, setProgramRerender, setProgramAdded, formHeader, formSubheader, existingName, existingDescription, existingColour, programSnowflake, isNew}) => {
  // State variables to store form input data
  const [programName, setProgramName] = useState<string>("");
  const [programDescription, setProgramDescription] = useState<string>("");
  const [programColour, setProgramColour] = useState<string>("ffffff");

  // Variable to hold the CSS colour variable for the colour picker display box
  const colourPickerDisplayBox = document.getElementById('program-colour-picker-display');

  // State variables to handel the loading state of form buttons
  const [blockedUI, setBlockUI] = useState<boolean>(false);

  // Variable to store the submitted state of the form
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [uniqueProgramName, setUniqueProgramName] = useState<boolean>(true);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // UseEffect hook to set the details of an existing program if the user is updating an existing program
  useEffect(() => {
    if(visible && !isNew) {
      setProgramName(existingName);
      setProgramDescription(existingDescription);
      setProgramColour(existingColour);
      colourPickerDisplayBox?.style.setProperty('--colour-picker-display-block', `#${existingColour}`);
    };
  }, [visible]);

  // Async function to handel the adding of programs to the system
  async function addProgramHandler(): Promise<void> {
    setBlockUI(true);
    setSubmitted(true);
    setUniqueProgramName(true);
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
      setBlockUI(false);
      return;
    };
    if(programDescription === "") {
      invalidData("description");
      setBlockUI(false);
      return;
    };
    // Ensure the entered program name is unique if either; the program is new or the existing program has had a name change
    if(programName.toUpperCase() !== existingName.toUpperCase()) {
      const isUnique: boolean | string = await isUniqueProgramName(programName);
      if(typeof isUnique === "string") {
        // Output an error message for the existing programs could not be retrieved
        toast.current?.show({
          severity: 'error',
          summary: 'An Unexpected Error Occurred',
          detail: `An unexpected error occurred while trying to validate the entered program name. Please try again.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setBlockUI(false);
        return;
      };
      if(!isUnique) {
        // Output a warning for the program name is not unique
        toast.current?.show({
          severity: 'warn',
          summary: 'Invalid Program Name',
          detail: `The entered program already exists. Please entered a new program and try again.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setBlockUI(false);
        setUniqueProgramName(false);
        return;
      };
    };
    
    // Attempted to add the entered program data to the system
    const successful: boolean = await saveProgram(programSnowflake, programName, programDescription, programColour, isNew);
    if(!successful) {
      // Output an error message for the program failing to add to the system
      toast.current?.show({
        severity: 'error',
        summary: 'An Unexpected Error Occurred',
        detail: `An unexpected error occurred while trying to add a new program to the system. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setBlockUI(false);
      return;
    };
    // Close form and return to program overviews
    setProgramAdded(true);
    setBlockUI(false);
    onFormClose();
    return;
  };

  // Arrow function to handel the input validation for hex colour codes using reges expressions
  const handleHexInput = (e: ColorPickerChangeEvent) => {
    const colour: string = (typeof e.value === "string") ? e.value : 'ffffff';
    colourPickerDisplayBox?.style.setProperty('--colour-picker-display-block', `#${colour}`);
    setProgramColour(colour);
  };

  // Function to handel closing the form
  const onFormClose = () => {
    setSubmitted(false);
    setProgramName("");
    setProgramDescription("");
    setProgramColour("ffffff");
    colourPickerDisplayBox?.style.setProperty('--colour-picker-display-block', `#ffffff`);
    setUniqueProgramName(true);
    setVisible(false);
    setVisiblePrograms(true);
    setProgramRerender(true);
  };

  // Return JSX
  return (
    <BlockUI blocked={blockedUI}>
      <Toast ref={toast}/>
      <Card title={`${formHeader}`} subTitle={`${formSubheader}`} style={{ display: visible ? 'block' : 'none' }}>
        <div className="add-program-form-field-top">
          <div className="p-inputgroup flex-1">
            <span className="p-float-label">
              <InputText
                id="program-snowflake"
                value={programSnowflake}
                disabled
                required
              />
              <label htmlFor="program-name">Program Snowflake</label>
            </span>
          </div>
        </div>

        <div className="add-program-form-field">
          <div className="p-inputgroup flex-1">
            <span className="p-float-label">
              <InputText
                id="program-name"
                value={programName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramName(e.target.value)}
                required
                className={classNames({ 'p-invalid': submitted && (!programName || !uniqueProgramName) })}
                aria-describedby='program-name-help'
              />
              <label htmlFor="program-name">Program Name</label>
            </span>
          </div>
          <small id="program-name-help" className='add-program-form-help-text'>
            Enter the name of the new program of study.
          </small>
          {submitted && (!programName || !uniqueProgramName) && <small className="p-error">A unique program name is required.</small>}
        </div>
        
        <div className="add-program-form-field">
          <div className="p-inputgroup flex-1">
            <span className="p-float-label">
              <InputText
                id="program-description"
                value={programDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramDescription(e.target.value)}
                required
                className={classNames({ 'p-invalid': submitted && !programDescription })}
                aria-describedby='program-description-help'
              />
              <label htmlFor="program-description">Program Description</label>
            </span>
          </div>
          <small id="program-description-help" className='add-program-form-help-text'>
            Enter a brief description of the new program of study.
          </small>
          {submitted && !programDescription && <small className="p-error">A program description is required.</small>}
        </div>
        
        <div className="add-program-form-field">
          <div className='program-colour-picker-colum'>
            <label htmlFor="cp-hex" className="font-bold block mb-2">
              Program Colour:
            </label>
            <div className='program-colour-picker-row'>
              <ColorPicker 
                inputId="cp-hex" 
                inline format="hex" 
                value={programColour} 
                onChange={(e: ColorPickerChangeEvent) => handleHexInput(e)} 
              />
              <div id='program-colour-picker-display' className='program-colour-picker-display'/>
            </div>
            <span>#{programColour}</span>
            <small id="program-description-help" className='add-program-form-help-text'>
              Select a colour to represent the program and it's badges.
            </small>
          </div>
        </div>

        <div className="add-program-form-button-field">
          <div className="add-program-form-button">
            <Button label="Save Program" icon="pi pi-save" loading={blockedUI} onClick={() => {
              addProgramHandler();
            }} raised severity="info"/>
          </div>
          <div className="add-program-form-button">
            <Button label="Cancel" icon="pi pi-times" onClick={onFormClose} raised severity="secondary"/>
          </div>
        </div>

      </Card>
    </BlockUI>
  );
};

export default NewProgramForm;
