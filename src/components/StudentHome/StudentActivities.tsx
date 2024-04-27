// Import core functions
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import { DataViewLayoutOptions, DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

// Import CSS
import './StudentActivities.css'

// Importing types
import { Activity } from '../../types/Global/Activity';

// Defining data interface for student activity dialogue box
interface StudentActivitiesDialogueProps {
  title: string;
  programName: string;
  activities: Activity[];
  visible: boolean;
  setVisible: (value: boolean) => void;
};

// React function to render the activities dialogue box for the student portal
const StudentActivitiesDialogue: React.FC<StudentActivitiesDialogueProps> = ({title, programName, activities, visible, setVisible}) => {
  //? Dialogue Box Templates
  // Defining template for the dialogue header
  const dialogueHeader = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <i className="pi pi-list" style={{ fontSize: '1rem' }}/>
      <span className="font-bold white-space-nowrap">
        {` ${title}`}
      </span>
    </div>
  );

  // Defining template for the dialogue footer //! Remove later if is still not in use
  // const dialogueFooter = (
  //   <div>
  //     <Button label="[Button Label]" icon="pi pi-check" severity='secondary' onClick={() => {}} autoFocus />
  //   </div>
  // );

  //? Data View Templates
  // State variable to control the layout of the data view
  const [layout, setLayout] = useState<string>('grid');

  // Function to set the colour of the activity difficulty tags
  const getSeverity = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'info';
      case 'Hard':
        return 'warning';
      case "Very Hard":
        return "danger";
      default:
        return null;
    };
  };

  // Defining activity card header template
  const cardHeader = (
    <img alt="activity-image" src='/assets/placeholdersmall.png' style={{ width: '100%', height: 'auto' }}/>
  );
  
  // Defining activity card footer template //! Remove later if still not in use
  // const cardFooter = (
  //   <>
  //     <Button outlined severity="success" icon="pi pi-send" />
  //   </>
  // );

  const listItem = (activity: Activity, index: number) => {
    
    const tag = (
      <Tag value={activity.difficulty} severity={getSeverity(activity.difficulty)}/>
    );

    return (
      <div className="student-activity-grid-item" key={index}>
        <Card title={`Activity ${activity.id}`} subTitle={tag} header={cardHeader} role={`Activity ${activity.id} Info Card`}>
          <div><b>Details:</b></div>
          <div>{activity.description}</div>
          <div><b>Awarded XP:</b></div>
          <div>{activity.xpValue}</div>
          <br/>
          <Button severity="success" icon="pi pi-send" outlined className='student-activity-button-round'/>
        </Card>
      </div>
    );
  };

  const gridItem = (activity: Activity, index: number) => {
    return (
      <div key={index}>
        {index === 0 && (<br/>)}
        <div className='student-activity-list-row'>
          <div><img alt="activity-image" src='/assets/placeholdersmall.png' style={{ width: '100%', height: 'auto' }}/></div>
          <div style={{ paddingLeft: '1rem' }}>
            <p><b>Activity {activity.id}</b></p>
            <div><b>Details:</b>{` ${activity.description}`}</div>
            <div><b>Awarded XP:</b>{` ${activity.xpValue}`}</div>
            <Tag value={activity.difficulty} severity={getSeverity(activity.difficulty)}/>
          </div>
          <div className='student-activity-list-right'>
            <Button severity="success" icon="pi pi-send" className='student-activity-button-round'/>
          </div>
        </div>
        <Divider/>
      </div>
    );
  };

  const itemTemplate = (activity: Activity, layout: string, index: number) => {
    if (!activity) {return;};
    return (layout === 'grid') ? listItem(activity, index) : gridItem(activity, index);
  };

  const listTemplate = () => {
    return <div className={(layout === "grid" ? "student-activity-grid-container" : "student-activity-list-col")}>{activities.map((activity, index) => itemTemplate(activity, layout, index))}</div>;
  };
  
  const dataViewHeader = () => {
    return (
      // <div className="flex justify-content-end">
      //   <DataViewLayoutOptions 
      //     layout={(layout === "grid") ? 'grid' : 'list'}
      //     onChange={(e) => setLayout(e.value)}
      //   />
      // </div>
      <div style={{ textAlign: 'right' }}>
        <Button outlined icon="pi pi-list" severity='info' onClick={() => setLayout("list")} />
        <Button outlined icon="pi pi-table" severity='help' onClick={() => setLayout("grid")} />
      </div>
    );
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
      style={{ minWidth: '52rem' }} 
      breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    >
      <p>View all the activities for {programName} and submit any completed activities for admin approval. Once submitted, if approved by an admin, you'll gain the stated XP for this program.</p>
      <div className="">
        <DataView value={[1]} itemTemplate={listTemplate} layout={(layout === "grid") ? 'grid' : 'list'} header={dataViewHeader()} />
      </div>
    </Dialog>
  );
};

export default StudentActivitiesDialogue;
