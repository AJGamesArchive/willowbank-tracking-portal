// Import core functions
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import { DataViewLayoutOptions, DataView } from 'primereact/dataview';

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

  // Defining template for the dialogue footer
  const dialogueFooter = (
    <div>
      <Button label="[Button Label]" icon="pi pi-check" severity='secondary' onClick={() => {}} autoFocus />
    </div>
  );

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

  const listItem = (activity: Activity, index: number) => {
    return (
      <div className="col-12" key={index}>
        <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src='/assets/placeholdersmall.png' alt={String(activity.id)} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{activity.description}</div>
              {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  {/* <span className="font-semibold">{product.category}</span> */}
                </span>
                <Tag value={activity.difficulty} severity={getSeverity(activity.difficulty)}></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">${activity.xpValue}</span>
              <Button icon="pi pi-shopping-cart" className="p-button-rounded"/>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (activity: Activity, index: number) => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={index}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              {/* <span className="font-semibold">{product.category}</span> */}
            </div>
            <Tag value={activity.difficulty} severity={getSeverity(activity.difficulty)}></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img className="w-9 shadow-2 border-round" src='/assets/placeholdersmall.png' alt={String(activity.id)} />
            <div className="text-2xl font-bold">{activity.description}</div>
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">${activity.xpValue}</span>
            <Button icon="pi pi-shopping-cart" className="p-button-rounded"/>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (activity: Activity, layout: string, index: number) => {
    if (!activity) {return;};
    if (layout === 'list') return listItem(activity, index);
    else if (layout === 'grid') return gridItem(activity, index);
  };

  const listTemplate = () => {
    return <div className="grid grid-nogutter">{activities.map((activity, index) => itemTemplate(activity, layout, index))}</div>;
  };

  const dataViewHeader = () => {
    return (
      <div className="flex justify-content-end">
        <DataViewLayoutOptions 
          layout={(layout === "grid") ? 'grid' : 'list'}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

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
      <div className="card">
        <DataView value={activities} itemTemplate={listTemplate} layout={(layout === "grid") ? 'grid' : 'list'} header={dataViewHeader()} />
      </div>
    </Dialog>
  );
};

export default StudentActivitiesDialogue;
