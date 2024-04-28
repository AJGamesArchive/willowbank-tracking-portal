// Import core functions
import { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

// Import CSS
import './EditAccountDetails.css'

// Interface to define the data pass through's for the edit account details component
interface EditAccountDetailsProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  editMode: string;
  existingUsername: string;
  existingFirstName: string;
  existingSurnameInitial: string;
  setReloadData: (value: boolean) => void;
};

// React function to render the edit account details dialogue box
const EditAccountDetails: React.FC<EditAccountDetailsProps> = ({visible, setVisible, editMode, existingUsername, existingFirstName, existingSurnameInitial, setReloadData}) => {
  // State variables to store editable account details
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [surnameInitial, setSurnnameInitial] = useState<string>("");

  // State variable to control the submitted state of the form
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  console.log(visible); //! Temp thing, remove later

  // Returning core JSX
  return (
    <>
      <Toast ref={toast}/>
      {/* <Dialog visible={visible} resizable={false} draggable={false} closeIcon='pi pi-times' style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Edit Account Details`} modal className="p-fluid" footer={activityDialogFooter} onHide={hideDialog}>
        <div>
          <label htmlFor="edit-account-first-name" className="font-bold">
            First Name
          </label>
          <InputText id="edit-account-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !activity.description })} />
          {submitted && !activity.description && <small className="p-error">Description is required.</small>}
        </div>

        <div className="edit-activity-data">
          <label htmlFor="description" className="font-bold">
            Date Added
          </label>
          <Calendar 
            value={date}
            onChange={(e) => onDatePickerChange(e)}
            showButtonBar
            showIcon
            icon='pi pi-calendar'
            decrementIcon='pi pi-angle-down'
            incrementIcon='pi pi-angle-up'
            nextIcon='pi pi-angle-right'
            prevIcon='pi pi-angle-left'
            dateFormat="dd/mm/yy"
            className={classNames({ 'p-invalid': submitted && !activity.dateAdded && (date === null) })}
          />
          {submitted && !activity.dateAdded && (date === null) && <small className="p-error">Date is required.</small>}
        </div>

        <div className="edit-activity-data">
          <label className="mb-3 font-bold">Difficulty</label>
            <Dropdown 
              value={activity.difficulty}
              options={difficultyOptions}
              onChange={(e: DropdownChangeEvent) => onDifficultyChange(e)} 
              itemTemplate={difficultyItemTemplate}
              placeholder="Select One" 
              className={classNames({ 'p-invalid': submitted && !activity.difficulty })}
              style={{ minWidth: '12rem' }} 
            />
            {submitted && !activity.difficulty && <small className="p-error">Difficulty is required.</small>}
        </div>

        <div className='edit-activity-data'>
          <div className="field col">
            <label htmlFor="xp" className="font-bold">
                XP Amount
            </label>
            <InputNumber 
              id='xp'
              value={activity.xpValue} 
              onValueChange={(e: InputNumberValueChangeEvent) => onInputXPChange(e, 'xpValue')}
              showButtons 
              buttonLayout="horizontal" 
              step={10}
              useGrouping={false}
              className={classNames({ 'p-invalid': submitted && (activity.xpValue < 1) })}
              decrementButtonClassName="p-button-danger" 
              incrementButtonClassName="p-button-success" 
              incrementButtonIcon="pi pi-plus" 
              decrementButtonIcon="pi pi-minus"
            />
            {submitted && (activity.xpValue < 1) && <small className="p-error">XP amount is required.</small>}
          </div>
        </div>

        <div className='edit-activity-data'>
          <div className="field col">
            <label htmlFor="activity-id" className="font-bold">
              Activity ID
            </label>
            <InputNumber id="activity-id" value={activity.id} disabled />
          </div>
        </div>
      </Dialog> */}
    </>
  );
};

export default EditAccountDetails;
