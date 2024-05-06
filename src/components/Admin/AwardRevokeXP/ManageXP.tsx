// Import core functions
import React from 'react';
import { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast, ToastMessage } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { updateStudentXP } from '../../../functions/Admin/AwardXP/UpdateStudentXP';

// Import CSS
import './ManageXP.css'

// Import types
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';
import { XPStudentAccountDetails } from '../../../types/Global/UserAccountDetails';
import { ProgramData } from '../../../types/Admin/ProgramData';

// Import function
import { retrieveXPData } from '../../../functions/Student/RetrieveXPData';
import { Button } from 'primereact/button';

// Data interface to define the props for the ManageXP component
interface ManageXPProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  student: CoreStudentAccountDetails;
  programs: ProgramData[];
  toastCallBack: (value: ToastMessage) => void;
};

// React function to render the manage XP dialogue box for the admin portal
const ManageXP: React.FC<ManageXPProps> = ({visible, setVisible, student, programs, toastCallBack}) => {
  // State variable to store the select program & student XP data
  const [selectedProgram, setSelectedProgram] = useState<ProgramData>(programs[0]);
  const [allXpData, setAllXPData] = useState<XPStudentAccountDetails[]>([]);
  const [selectedXPData, setSelectedXPData] = useState<XPStudentAccountDetails>({
    programName: '',
    dateStarted: '',
    currentLevel: -1,
    previousTargetXP: -1,
    currentXP: -1,
    targetXP: -1,
    completedActivities: [],
    pendingActivities: [],
  });

  // Other state variables
  const [xpValue, setXPValue] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Function to control actions upton the dialogue show
  const onDialogueShow = async () => {
    const baseXPData: XPStudentAccountDetails[] | string = await retrieveXPData(student.snowflake);
    if(typeof baseXPData === "string") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: `Some or all data required for this page could not be loaded. As a result, some components may not display properly and some actions will be incompletable. Refresh the page to try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setLoading(false);
      return;
    };
    setAllXPData(baseXPData);
    baseXPData.forEach((x) => {
      if(x.programName === programs[0].name) {
        setSelectedXPData(x);
        setXPValue(x.currentXP);
      };
    });
    setLoading(false);
    setShowForm(true);
  };

  // Function to control actions upton the dialogue hide
  const onDialogueHide = () => {
    setVisible(false);
    setLoading(true);
    setShowForm(false);
    setSubmitted(false);
    setSelectedProgram(programs[0]);
  };

  const onFilterChange = (e: DropdownChangeEvent) => {
    setSubmitted(false);
    const filterProgram: ProgramData = e.value;
    setSelectedProgram(e.value);
    allXpData.forEach((x) => {
      if(x.programName === filterProgram.name) {
        setSelectedXPData(x);
        setXPValue(x.currentXP);
      };
    });
  };

  const onSave = async (): Promise<void> => {
    setSubmitted(true);
    if(xpValue === selectedXPData.currentXP) {onDialogueHide(); return;}
    if(xpValue < 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Invalid XP Amount',
        detail: `The entered XP value cannot be less than 0. Please update the value and try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };
    setShowForm(false);
    setLoading(true);
    const success: boolean = await updateStudentXP(student.snowflake, selectedProgram.snowflake, xpValue);
    if(!success) {
      toast.current?.show({
        severity: 'error',
        summary: 'Unexpected Error',
        detail: `An unexpected error occurred while trying to update ${student.firstName} ${student.surnameInitial}'s XP value. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };
    toastCallBack({
      severity: 'success',
      summary: 'XP Value Updated',
      detail: `${student.firstName} ${student.surnameInitial}'s current XP value has been successfully updated.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });
    onDialogueHide();
    return;
  };

  // Const to define the header for the dialogue box
  const header = (
    <React.Fragment>
      <h2>{`Manage XP for ${student.firstName} ${student.surnameInitial}`}</h2>
      <div style={{paddingTop: '2px'}}>
        Select a program:
      </div>
      <div className="p-inputgroup flex-1">
        <Dropdown 
          value={selectedProgram}
          onChange={(e: DropdownChangeEvent) => onFilterChange(e)}
          options={programs}
          optionLabel="name" 
          placeholder="Select a Program" className="w-full md:w-14rem" 
        />
      </div>
    </React.Fragment>
  );

  // Const to define the footer for the dialogue box
  const footer = (
    <React.Fragment>
      <Button label="Save" icon="pi pi-save" severity='success' onClick={onSave} />
    </React.Fragment>
  );

  // Return core JSX dialogue box
  return (
    <Dialog
      visible={visible} 
      resizable={false}
      draggable={false} 
      closeIcon='pi pi-times' 
      style={{ width: '38rem' }} 
      breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
      header={header}
      footer={footer}
      modal
      closeOnEscape={true}
      className="p-fluid" 
      onHide={onDialogueHide}
      onShow={onDialogueShow}
    >
      <Toast ref={toast}/>
      {loading && <div style={{textAlign: 'center'}}>
        <ProgressSpinner/>
      </div>}
      {showForm && <div>
        <div className="field col">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Selected Program:`}</b></div>
            <div className="rightContent">{selectedXPData.programName}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Current Level:`}</b></div>
            <div className="rightContent">{`LvL ${selectedXPData.currentLevel}`}</div>
          </div>

          <Divider/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Selected Experience:`}</b></div>
            <div className="rightContent">{`${selectedXPData.currentXP}xp`}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Next Target Experience:`}</b></div>
            <div className="rightContent">{`${selectedXPData.targetXP}xp`}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Experience Required for Next Level:`}</b></div>
            <div className="rightContent">{`${selectedXPData.targetXP - selectedXPData.currentXP}xp`}</div>
          </div>

          <Divider/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent"><b>{`Date Started Program:`}</b></div>
            <div className="rightContent">{selectedXPData.dateStarted}</div>
          </div>

          <Divider/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent-w"><b>{`Warning:`}</b></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <div className="leftContent-wl">{`If you revoke enough XP to lower the students level, all badges awarded for the revoked levels will also be revoked.`}</div>
          </div>

          <label htmlFor="xp" className="font-bold">
            XP Amount
          </label>
          <InputNumber 
            id='xp'
            value={xpValue}
            onValueChange={(e: InputNumberValueChangeEvent) => setXPValue(e.value ?? 0)}
            showButtons 
            buttonLayout="horizontal" 
            step={10}
            useGrouping={false}
            className={classNames({ 'p-invalid': submitted && (xpValue < 0) })}
            decrementButtonClassName="p-button-danger" 
            incrementButtonClassName="p-button-success" 
            incrementButtonIcon="pi pi-plus" 
            decrementButtonIcon="pi pi-minus"
          />
          {submitted && (xpValue < 0) && <small className="p-error">An XP amount is required..</small>}
        </div>
      </div>}
    </Dialog>
  );
};

export default ManageXP;
