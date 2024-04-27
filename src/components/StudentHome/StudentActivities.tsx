// Import core functions
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

// Import CSS
import './StudentActivities.css'

// Importing types
import { Activity } from '../../types/Global/Activity';

// Defining data interface for student activity dialogue box
interface StudentActivitiesDialogueProps {
  title: string;
  activities: Activity[];
  visible: boolean;
  setVisible: (value: boolean) => void;
};

// React function to render the activities dialogue box for the student portal
const StudentActivitiesDialogue: React.FC<StudentActivitiesDialogueProps> = ({title, activities, visible, setVisible}) => {
  // Defining template for the dialogue header
  const dialogueHeader = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <i className="pi pi-list" style={{ fontSize: '1rem' }}/>
      <span className="font-bold white-space-nowrap">
        {` ${title}`}
      </span>
    </div>
  );

  // Defining template for the dialogue footer
  const dialogueFooter = (
    <div>
      <Button label="[Button Label]" icon="pi pi-check" severity='secondary' onClick={() => {}} autoFocus />
    </div>
  );

  // Return core JXS
  return (
    <Dialog 
      visible={visible} 
      onHide={() => {setVisible(false)}} 
      header={dialogueHeader}
      footer={dialogueFooter}
      closeIcon='pi pi-times'
      blockScroll={true}
      draggable={false}
      resizable={false}
      style={{ width: '32rem' }} 
      breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    >
      [Dialogue Content]
    </Dialog>
  );
};

export default StudentActivitiesDialogue;
