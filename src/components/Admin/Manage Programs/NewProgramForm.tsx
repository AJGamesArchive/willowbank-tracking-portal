// Import core functions
import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import { BlockUI } from 'primereact/blockui';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// Import CSS
import './NewProgramForm.css';

// Import functions
import { saveProgram } from '../../../functions/Admin/ManagePrograms/SaveProgram';
import { classNames } from 'primereact/utils';
import { isUniqueProgramName } from '../../../functions/Validation/IsUniqueProgramName';
import { generateBadgeSVG } from '../../../functions/Badges/GenerateBadgeSVG';

// Importing data
import { badgeShapes } from '../../../data/BadgeShapes';

// Importing types
import { ProgramData } from '../../../types/Admin/ProgramData';

// Interface to define props for the new program form
interface NewProgramFormProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setVisiblePrograms: (value: boolean) => void;
  setProgramRerender: (value: boolean) => void;
  setProgramAdded:(value: boolean) => void;
  formHeader: string;
  formSubheader: string;
  existingData: ProgramData
  isNew: boolean;
};

// React function to render the login page for mobile devices
//TODO When validating for unique program names, the system needs to ensure the new name is also unique to any deleted program names
const NewProgramForm: React.FC<NewProgramFormProps> = ({visible, setVisible, setVisiblePrograms, setProgramRerender, setProgramAdded, formHeader, formSubheader, existingData, isNew}) => {
  // State variables to store form input data
  const [programName, setProgramName] = useState<string>("");
  const [programDescription, setProgramDescription] = useState<string>("");
  const [programColour, setProgramColour] = useState<string>("ffffff");
  const [programShape, setProgramShape] = useState<string>("Square");
  const [programTextColor, setProgramTextColor] = useState<string>("Black");

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
      setProgramName(existingData.name);
      setProgramDescription(existingData.description);
      setProgramColour(existingData.colour);
      setProgramShape(existingData.badgeShape);
      setProgramTextColor(existingData.badgeTextColor);
      colourPickerDisplayBox?.style.setProperty('--colour-picker-display-block', `#${existingData.colour}`); //! Maybe remove later? I don't think it's used anymore. Same oes for corresponding CSS.
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
    if(programName.includes('-')) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Invalid Character(s)',
        detail: `Program names must not contain any '-'. Please remove these character(s) and try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setBlockUI(false);
      return;
    };
    if(programDescription === "") {
      invalidData("description");
      setBlockUI(false);
      return;
    };
    if(!programColour) {
      invalidData("badge color");
      setBlockUI(false);
      return;
    };
    if(!programShape) {
      invalidData("badge shape");
      setBlockUI(false);
      return;
    };
    if(!programTextColor) {
      invalidData("badge text color");
      setBlockUI(false);
      return;
    };
    // Ensure the entered program name is unique if either; the program is new or the existing program has had a name change
    if(programName.toUpperCase() !== existingData.name.toUpperCase()) {
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
    const successful: boolean = await saveProgram(existingData.snowflake, programName, programDescription, programColour, programShape, programTextColor, isNew);
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
    setProgramShape("Square");
    setProgramTextColor("Black");
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
                value={existingData.snowflake}
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

        <div className='add-program-form-field'>
          <label htmlFor="cp-hex" className="font-bold block mb-2">
            Program Badge Designer:
          </label>
        </div>

        <div className='add-program-form-field'>
          <div className='p-inputgroup-flex-l'>
            <span className='p-float-label'>
              <Dropdown 
                  value={programShape}
                  options={badgeShapes}
                  onChange={(e: DropdownChangeEvent) => setProgramShape(e.value)}
                  placeholder="Select Badge SHape"
                  className={classNames({ 'p-invalid': submitted && !programShape })}
                  style={{ minWidth: '24rem' }}
                />
                <label htmlFor="program-badge-shape">Program Badge Shape</label>
            </span>
            <small id="program-badge-shape-help" className='add-program-form-help-text'>
              Select the shape you want to use for this programs badges.
            </small>
          </div>
          {submitted && !programShape && <small className="p-error">Program badge shape is required.</small>}
        </div>

        <div className='add-program-form-field'>
          <div className='p-inputgroup-flex-l'>
            <span className='p-float-label'>
              <Dropdown 
                  value={programTextColor}
                  options={["Black", "White"]}
                  onChange={(e: DropdownChangeEvent) => setProgramTextColor(e.value)}
                  placeholder="Select Badge Text Color"
                  className={classNames({ 'p-invalid': submitted && !programTextColor })}
                  style={{ minWidth: '24rem' }}
                />
                <label htmlFor="program-badge-text-color">Program Badge Shape</label>
            </span>
            <small id="program-badge-text-color-help" className='add-program-form-help-text'>
              Select the color you want the badge level text to display in.
            </small>
          </div>
          {submitted && !programTextColor && <small className="p-error">Program badge text color is required.</small>}
        </div>
        
        <div className="add-program-form-field">
          <div className='program-colour-picker-colum'>
            <label htmlFor="cp-hex" className="font-bold block mb-2">
              Program Badge Color:
            </label>
            <br/>
            <div className='program-colour-picker-row'>
              <ColorPicker 
                inputId="cp-hex"
                inline format="hex" 
                value={programColour} 
                onChange={(e: ColorPickerChangeEvent) => handleHexInput(e)} 
              />
              {/* <div id='program-colour-picker-display' className='program-colour-picker-display'/> */}
              <div>
                <img src={generateBadgeSVG(programShape, programColour, programTextColor.toLowerCase(), "1")} alt="Badge.svg"/>
              </div>
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
