// Import core functions
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber,InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { BlockUI } from 'primereact/blockui';
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';

// Import CSS
import './ViewActivities.css';

// Import Types
import { Activity } from '../../../types/Global/Activity';

// Import functions
import { retrieveAllActivities } from '../../../functions/Admin/ManagePrograms/RetrieveActivityData';
import { isEmptyString } from '../../../functions/Validation/IsEmptyString';
import { isLessThan } from '../../../functions/Validation/IsLessThan';
import { saveActivityData } from '../../../functions/Admin/ManagePrograms/SaveActivity';
import { deleteActivities } from '../../../functions/Admin/ManagePrograms/DeleteActivity';
import { generateActivityID } from '../../../functions/Admin/ManagePrograms/GenerateActivityID';

// Interface defining props for the ViewActivities page
interface ViewActivitiesProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setProgramsVisible: (value: boolean) => void;
  programName: string;
  snowflake: string;
};

// React function to render the view activities components
// TODO Work out why a firebase error occurs if this page is left open for to long - nothing seems to brake?
const ViewActivities: React.FC<ViewActivitiesProps> = ({visible, setVisible, setProgramsVisible, programName, snowflake}) => {
  //? Default object(s)
  // Defining an empty activity object
  const emptyActivity: Activity = {
    id: 0,
    description: "",
    xpValue: 0,
    dateAdded: "",
    difficulty: "",
  };

  //? State Variables
  // Array to store all activity data for the selected program
  const [activities, setActivities] = useState<Activity[]>([]);

  // Variable to store the details of a single activity - defaults to an empty activity object
  const [activity, setActivity] = useState<Activity>(emptyActivity);

  // Variable to handle values passed to and from the data picker
  const [date, setDate] = useState<Date | null>(null);

  // Array to store all activities currently selected in the data table
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  // String to store the user entered filter from the search box
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // Flags to control the visibility of confirmation dialogue pop-ups
  const [activityDialog, setActivityDialog] = useState<boolean>(false);
  const [deleteActivityDialog, setDeleteActivityDialog] = useState<boolean>(false);
  const [deleteActivitiesDialog, setDeleteActivitiesDialog] = useState<boolean>(false);

  // Flag to control the submission state of a form
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Flags to control blocking the UI interaction while processes are carried out
  const [blocked, setBlocked] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  // Variable to store all activity difficulties
  //TODO Maybe add an 'undefined/unclassified' tag to this list?
  const [difficultyOptions] = useState([
    {
      label: "Easy",
      value: "Easy",
      severity: "success"
    },
    {
      label: "Medium",
      value: "Medium",
      severity: "info"
    },
    {
      label: "Hard",
      value: "Hard",
      severity: "warning"
    },
    {
      label: "Very Hard",
      value: "Very Hard",
      severity: "danger"
    },
  ]);

  //? Async functions to read and write data
  // Async function to handel the retrieval of all activity data from the DB
  async function retrieveActivitiesHandler(): Promise<void> {
    const data = await retrieveAllActivities(snowflake);
    if(typeof data === "string") {
      // Output an error message for error retrieving activity data
      toast.current?.show({
        severity: 'error',
        summary: 'An Unexpected Error Occurred',
        detail: `An unexpected error occurred while trying to load existing activity data. Please re-load the page and try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };
    // Sort the array of activities by their activity ID
    data.sort((a, b) => a.id - b.id);
    setActivities(data);
    return;
  };

  // Async function to update existing activity details and add new activities
  async function saveActivityDataHandler(): Promise<void> {
    setSubmitted(true);
    setBlocked(true);
    setButtonLoading(true);
    // Defining error and warning messages for validation
    const missingData = (missingField: string) => {
      toast.current?.show({ 
        severity: 'warn',
        summary: `Missing ${missingField}`,
        detail: `You have not entered a ${missingField} for the given activity. Please fill in the ${missingField} box.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setBlocked(false);
      setButtonLoading(false);
    };
    const invalidXP = () => {
      toast.current?.show({ 
        severity: 'warn',
        summary: `Invalid XP Amount`,
        detail: `You have entered an XP amount that is lower than 1 meaning the activity rewards nothing. Please ensure the activity awards some XP.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setBlocked(false);
      setButtonLoading(false);
    };

    // Validating the users inputs
    if(isEmptyString(activity.description)) {missingData("Description"); return;}
    if(isEmptyString(activity.dateAdded)) {missingData("Creation Date"); return;}
    if(date === null) {missingData("Creation Date"); return;}
    if(isEmptyString(activity.difficulty)) {missingData("Difficulty"); return;}
    if(isLessThan(activity.xpValue, 1)) {invalidXP(); return;}

    // Generate an activity ID if the activity is a new entry
    let isNew: boolean = false;
    if(activity.id === 0) {
      isNew = true;
      const id: string | number = await generateActivityID(snowflake);
      if(typeof id === "string") {
        toast.current?.show({ 
          severity: 'error',
          summary: 'Unexpected Error',
          detail: 'An unexpected error occurred while trying to generate a new activity ID. Please try again.',
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setBlocked(false);
        setButtonLoading(false);
        return;
      };
      let updatedActivity = { ...activity };
      updatedActivity["id"] = id;
      activity.id = id;
    };

    // Save the updated activity to the database
    const success: boolean = await saveActivityData(activity, isNew, snowflake);
    if(!success) {
      toast.current?.show({ 
        severity: 'error',
        summary: 'Unexpected Error',
        detail: 'An unexpected error occurred while trying to update the activity details. Please try again.',
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setBlocked(false);
      setButtonLoading(false);
      return;
    };

    // Update the on-screen table
    if(isNew) {
      activities.push(activity);
    };
    if(!isNew) {
      for(let i = 0; i < activities.length; i++) {
        if(activities[i].id !== activity.id) {continue;}
        activities[i] = activity;
        break;
      };
    };

    // Output confirmation message
    toast.current?.show({ 
      severity: 'success',
      summary: 'Activity Saved',
      detail: 'The updated activity data was saved successfully.',
      closeIcon: 'pi pi-times',
      life: 7000,
    });

    setActivityDialog(false);
    setBlocked(false);
    setButtonLoading(false);
    setActivity(emptyActivity);
    return;
  };

  // Async function to handel deleting activities
  async function deleteActivitiesHandler(): Promise<void> {
    setBlocked(true);
    setButtonLoading(true);
    // Delete given activities from the DB
    const success: boolean = await deleteActivities(selectedActivities, snowflake);
    if(!success) {
      toast.current?.show({ 
        severity: 'error',
        summary: 'Unexpected Error',
        detail: 'An unexpected error occurred while trying to delete the activities. Please try again.',
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setSelectedActivities([]);
      setActivity(emptyActivity);
      setBlocked(false);
      setButtonLoading(false);
      setDeleteActivityDialog(false);
      setDeleteActivitiesDialog(false);
      return;
    };

    // Output confirmation message
    toast.current?.show({ 
      severity: 'success',
      summary: 'Activities Deleted',
      detail: 'All selected activities were deleted successfully.',
      closeIcon: 'pi pi-times',
      life: 7000,
    });

    // Re-load on screen table
    retrieveActivitiesHandler();
    setSelectedActivities([]);
    setActivity(emptyActivity);
    setBlocked(false);
    setButtonLoading(false);
    setDeleteActivityDialog(false);
    setDeleteActivitiesDialog(false);
    return;
  };

  //? UseEffect Hook
  useEffect(() => {
    if(visible) {
      retrieveActivitiesHandler();
    };
  }, [visible]);

  //? Misc Variables
  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Variable to define the data table data type
  const dt = useRef<DataTable<Activity[]>>(null);

  //? Component & Template Functions
  // Function to handel saving an activity
  const saveActivity = () => {
    saveActivityDataHandler();
  };

  // Function to delete all selected activities
  const deleteSelectedActivities = () => {
    deleteActivitiesHandler();
  };

  // Call to open the activity dialogue pop-up
  const openNew = () => {
    setActivity(emptyActivity);
    setDate(null);
    setSubmitted(false);
    setActivityDialog(true);
  };

  // Function to export the current data as a .csv file
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // Function to get the severity of an activity for the difficulty tags
  const getSeverity = (activity: Activity): any => {
    switch (activity.difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'info';
      case 'Hard':
        return 'warning';
      case "Very Hard":
        return "danger"
      default:
        return "";
    };
  };

  // Call the activity dialogue box
  const editActivity = (activity: Activity) => {
    setActivity({ ...activity });
    const [day, month, year] = activity.dateAdded.split('/').map(Number);
    const activityDate: Date = new Date(year, month - 1, day);
    if(isNaN(activityDate.getTime())) {
      toast.current?.show({ 
        severity: 'warn',
        summary: 'Unconfirmed Date',
        detail: 'The selected activities creation date could not be confirmed. Please re-enter the creation date.',
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setDate(null);
    } else {
      setDate(activityDate);
    };
    setActivityDialog(true);
  };

  // Call the delete single activity dialogue box
  const confirmDeleteProduct = (activity: Activity) => {
    setActivity(activity);
    setSelectedActivities([activity]);
    setDeleteActivityDialog(true);
  };

  // Call the delete multiple activities dialogue box
  const confirmDeleteSelected = () => {
    setDeleteActivitiesDialog(true);
  };

  // Function to hide the activity dialogue pop-up
  const hideDialog = () => {
    setSubmitted(false);
    setActivityDialog(false);
  };

  // Function to hide the delete activity dialogue box
  const hideDeleteActivityDialog = () => {
    setDeleteActivityDialog(false);
  };

  // Function to hide the delete activities dialogue box
  const hideDeleteActivitiesDialog = () => {
    setDeleteActivitiesDialog(false);
  };

  // Function to update an activities description as the user types in the input box
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>, description: string) => {
    const value = (e.target && e.target.value) || '';
    let updatedActivity = { ...activity };
    // @ts-ignore
    updatedActivity[description] = value;
    setActivity(updatedActivity);
  };

  // Function to update an activities date as the user types in the input mask
  const onDatePickerChange = (e: any) => {
    let updatedActivity = { ...activity };
    updatedActivity.dateAdded = (e.value) ? format(e.value, "dd/MM/yyyy") : '';
    setActivity(updatedActivity);
    setDate(e.value);
  };

  // Function to update an activities difficulty when the user selects a new difficulty
  const onDifficultyChange = (e: DropdownChangeEvent) => {
    let updatedActivity = { ...activity };
    updatedActivity['difficulty'] = e.value;
    setActivity(updatedActivity);
  };

  // Function to update an activities xp amount when the user enters a new amount
  const onInputXPChange = (e: InputNumberValueChangeEvent, xp: string) => {
    const value = e.value ?? 0;
    let updatedActivity = { ...activity };
    // @ts-ignore
    updatedActivity[xp] = value;
    setActivity(updatedActivity);
  };

  //? Component Function Templates
  // Creating a Toolbar component template for the view activities page toolbar start position
  const toolbarStartTemplate = () => {
    return (
      <BlockUI blocked={blocked}>
        <div className="flex flex-wrap gap-2">
          <Button label="New" icon="pi pi-plus" raised severity="success" onClick={openNew} />
          <Button label="Delete" icon="pi pi-trash" raised severity="danger" onClick={confirmDeleteSelected} disabled={!selectedActivities || !selectedActivities.length} />
        </div>
      </BlockUI>
    );
  };

  // Creating a Toolbar component template for the view activities page toolbar end position
  const toolbarEndTemplate = () => {
    return (
      <BlockUI blocked={blocked}>
        <div className="flex flex-wrap gap-2">
          <Button label="Export All" icon="pi pi-upload" raised className="p-button-help" onClick={exportCSV} />
          <Button label="Back to Programs" icon="pi pi-arrow-left" onClick={() => {
            setVisible(false);
            setActivities([]);
            setProgramsVisible(true);
          }} raised severity="secondary"/>
        </div>
      </BlockUI>
    );
  };

  // Defining template for the difficulty tag tab of the data table
  const statusBodyTemplate = (rowData: Activity) => {
    return <Tag value={rowData.difficulty} severity={getSeverity(rowData)}></Tag>;
  };

  // Defining template for the action buttons end colum of the data table
  const actionBodyTemplate = (rowData: Activity) => {
    return (
      <React.Fragment>
        <BlockUI blocked={blocked}>
          <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editActivity(rowData)} />
          <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
        </BlockUI>
      </React.Fragment>
    );
  };

  // Defining the template for the difficulty selection dropdown menu
  const difficultyItemTemplate = (options: any) => {
    return <Tag value={options.label} severity={options.severity} />;
  };

  //? Component Templates
  // Template to define the data table header
  const header = (
    <BlockUI blocked={blocked}>
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h2 className="activity-table-title">Manage {programName} Activities</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
        </span>
      </div>
    </BlockUI>
  );

  // Template to define the data tables footer
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer={`Total ${programName} Activities:`} colSpan={6} footerStyle={{ textAlign: 'right' }} />
        <Column footer={activities.length} />
      </Row>
    </ColumnGroup>
  );

  // Template to define the footer of the activity dialogue box
  const activityDialogFooter = (
    <React.Fragment>
      <BlockUI blocked={blocked}>
        <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} severity='secondary' />
        <Button label="Save" loading={buttonLoading} icon="pi pi-check" severity='info' onClick={saveActivity} />
      </BlockUI>
    </React.Fragment>
  );

  // Template to define the footer of the delete a single activity dialogue box
  const deleteActivityDialogFooter = (
    <React.Fragment>
      <BlockUI blocked={blocked}>
        <Button label="No" icon="pi pi-times" severity='secondary' onClick={hideDeleteActivityDialog} />
        <Button label="Yes" loading={buttonLoading} icon="pi pi-check" severity="danger" onClick={deleteSelectedActivities} />
      </BlockUI>
    </React.Fragment>
  );

  // Template to define the footer of the delete multiple activities dialogue box
  const deleteActivitiesDialogFooter = (
    <React.Fragment>
      <BlockUI blocked={blocked}>
        <Button label="No" icon="pi pi-times" severity='secondary' onClick={hideDeleteActivitiesDialog} />
        <Button label="Yes" loading={buttonLoading} icon="pi pi-check" severity="danger" onClick={deleteSelectedActivities} />
      </BlockUI>
    </React.Fragment>
  );

  //? Main JSX Return
  // Return JSX
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Toast ref={toast}/>
      <BlockUI blocked={blocked}>
        <div className="card">
          <Toolbar className="mb-4" start={toolbarStartTemplate} end={toolbarEndTemplate}></Toolbar>
          <DataTable 
            ref={dt} 
            value={activities} 
            selection={selectedActivities} 
            footerColumnGroup={footerGroup}
            onSelectionChange={(e) => {
              if(Array.isArray(e.value)) {
                setSelectedActivities(e.value);
              };
            }}
            dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}
            selectionMode="multiple"
          >
            <Column selectionMode="multiple" exportable={false}></Column>
            <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
            <Column field="description" header="Description" style={{ minWidth: '23rem' }}></Column>
            <Column field="xpValue" sortable header="XP" style={{ minWidth: '7rem' }}></Column>
            <Column field="dateAdded" header="Date Added" sortable style={{ minWidth: '10rem' }}></Column>
            <Column field="difficulty" header="Difficulty" body={statusBodyTemplate} style={{ minWidth: '12rem' }}></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          </DataTable>
        </div>

        <Dialog visible={activityDialog} closeIcon='pi pi-times' style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Activity ${activity.id} Details`} modal className="p-fluid" footer={activityDialogFooter} onHide={hideDialog}>
          <div>
            <label htmlFor="activity-description" className="font-bold">
              Description
            </label>
            <InputText id="activity-description" value={activity.description} onChange={(e) => onDescriptionChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !activity.description })} />
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
        </Dialog>

        <Dialog visible={deleteActivityDialog} closeIcon='pi pi-times' style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteActivityDialogFooter} onHide={hideDeleteActivityDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <br />
            {activity && (
              <span>
                Are you sure you want to delete 'Activity <b>{activity.id}'</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog visible={deleteActivitiesDialog} closeIcon='pi pi-times' style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteActivitiesDialogFooter} onHide={hideDeleteActivitiesDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <br />
            {activity && <span>Are you sure you want to delete the selected activities?</span>}
          </div>
        </Dialog>
      </BlockUI>
    </div>
  );
};

export default ViewActivities;
