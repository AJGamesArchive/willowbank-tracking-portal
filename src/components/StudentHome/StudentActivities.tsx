// Import core functions
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

// Import CSS
import './StudentActivities.css'

// Importing types
import { Activity } from '../../types/Global/Activity';
import { AssessedActivities } from '../../types/Student/AssessedActivities';

// Defining data interface for student activity dialogue box
interface StudentActivitiesDialogueProps {
  title: string;
  programName: string;
  activities: AssessedActivities[];
  visible: boolean;
  setVisible: (value: boolean) => void;
  onActivityClick: (value: number) => void;
};

// React function to render the activities dialogue box for the student portal
const StudentActivitiesDialogue: React.FC<StudentActivitiesDialogueProps> = ({title, programName, activities, visible, setVisible, onActivityClick}) => {
  //? Dialogue Box Templates
  // Defining template for the dialogue header
  const dialogueHeader = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <i className="pi pi-list" style={{ fontSize: '1rem' }}/>
      <span className="font-bold white-space-nowrap">
        {` ${title}`}
      </span>
      <p>View all the activities for {programName} and submit any completed activities for admin approval. Once submitted, if approved by an admin, you'll gain the stated XP for this program.</p>
      <div style={{ textAlign: 'right' }}>
        <Button outlined icon="pi pi-list" severity='info' onClick={() => setLayout("list")} />
        <Button outlined icon="pi pi-table" severity='help' onClick={() => setLayout("grid")} />
      </div>
    </div>
  );

  //? Data View Templates
  // State variable to control the layout of the data view
  const [layout, setLayout] = useState<string>('grid');

  // Function to set the colour of the activity difficulty tags
  const getSeverity = (difficulty: string) => {
    switch (difficulty) {
      case 'Unset':
        return 'info';
      case 'Easy':
        return null;
      case 'Medium':
        return "success";
      case 'Hard':
        return 'warning';
      case "Very Hard":
        return "danger";
      default:
        return null;
    };
  };

  const getStatusColour = (completed : boolean, pending : boolean) =>
  {
    if (completed) 
      return "success";
    else if (pending)
      return "warning";
    else
      return null;
  }

  const getStatusMessage = (completed : boolean, pending : boolean) =>
  {
    if (completed) 
      {
        return "Completed"
      }
    else if (pending)
      {
        return "Pending approval"
      }
    else
    {
      return "Not completed"
    }
  }

  const checkDisabled = (completed : boolean, pending : boolean) =>
  {
    return (completed || pending)
  }
  // Defining activity card header template
  const cardHeader = (
    <img alt="activity-image" src='/assets/placeholdersmall.png' style={{ width: '100%', height: 'auto' }}/>
  );

  const listItem = (activity: Activity, completed: boolean, pending: boolean, completionDate: string, index: number) => {
    return (
      <div className="student-activity-grid-item" key={index}>
        <Card header={cardHeader} title={`Activity ${activity.id}`} role={`Activity ${activity.id} Info Card`} className='student-activity-card'>
          <div className="header-row">
            <div className="header-item"><Tag value={activity.difficulty} severity={getSeverity(activity.difficulty)}/></div>
            <div className="header-item"><Tag value={getStatusMessage(completed, pending)} severity={getStatusColour(completed, pending)}/></div>
          </div>
          <div><b>Details:</b> {activity.description}</div>
          <div><b>Awarded XP:</b> {activity.xpValue}</div>
          <br/>
          <div><b>Date Completed:</b>{` ${completionDate}`}</div>
          <br/>
          <Button 
            label="Mark completed" 
            icon="pi pi-check-square" 
            outlined 
            className='student-activity-button-round' 
            onClick={() => onActivityClick(activity.id)}
            disabled={checkDisabled(completed, pending)}/>
        </Card>
      </div>
    );
  };

  const gridItem = (activity: Activity, completed: boolean, pending: boolean, completionDate: string, index: number) => {
    return (
      <div key={index}>
        {index === 0 && (<br/>)}
        <div className='student-activity-list-row'>
          <div style={{ paddingLeft: '1rem', marginTop: 0 }}>
            <div className="header-row">
              <h2 className="header-item">Activity {activity.id}</h2>
              <div className="header-item"><Tag value={activity.difficulty} severity={getSeverity(activity.difficulty)}/></div>
              <div className="header-item"><Tag value={getStatusMessage(completed, pending)} severity={getStatusColour(completed, pending)}/></div>
            </div>
            
            <div><b>Details:</b>{` ${activity.description}`}</div>
            <div><b>Awarded XP:</b>{` ${activity.xpValue}`}</div>
            <br/>
            <div><b>Date Completed:</b>{` ${completionDate}`}</div>
          </div>
          <div className='student-activity-list-right'>
            <Button 
              label="Mark completed" 
              icon="pi pi-check-square" 
              outlined
              className='student-activity-button-round' 
              onClick={() => onActivityClick(activity.id)} 
              disabled={checkDisabled(completed, pending)}/>
          </div>
        </div>
        <Divider/>
      </div>
    );
  };

  const itemTemplate = (activity: Activity, completed: boolean, pending: boolean, completionDate: string, layout: string, index: number) => {
    if (!activity) {return;};
    return (layout === 'grid') ? listItem(activity, completed, pending, completionDate, index) : gridItem(activity, completed, pending, completionDate, index);
  };

  const listTemplate = () => {
    return <div className={(layout === "grid" ? "student-activity-grid-container" : "student-activity-list-col")}>{activities.map((activity, index) => itemTemplate(activity.activity, activity.completed, activity.pending, activity.date, layout, index))}</div>;
  };

  // Return core JXS
  return (
    <Dialog 
      visible={visible} 
      onHide={() => {setVisible(false)}} 
      header={dialogueHeader}
      closeIcon='pi pi-times'
      blockScroll={true}
      draggable={false}
      resizable={false} 
      style={{ minWidth: '52rem', padding: '5px'}} 
      breakpoints={{'960px': '75vw', '641px': '90vw'}} 
    >
      <div className="">
        <DataView value={[1]} itemTemplate={listTemplate} layout={(layout === "grid") ? 'grid' : 'list'} />
      </div>
    </Dialog>
  );
};

export default StudentActivitiesDialogue;
