// Import core functions
import { useState } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

// Import types
import { ActivityRequests } from '../../../types/Global/ActivityCompletionRequests';

// Import CSS
import './ActivityRequestCard.css'

// Defining data interface for the activity requests card
interface ActivityRequestCardProps {
  request: ActivityRequests;
  mapId: number;
};

// React function to render the activity request card for the activity requests dialogue box
const ActivityRequestCard: React.FC<ActivityRequestCardProps> = ({request, mapId}) => {
  // State variable to control the loading state of varying UI components
  const [loading, setLoading] = useState<boolean>(false);
  
  // Function to set the XP tag severity
  const getTagSeverity = (value: number) => {
    if(value < 50) return "success";
    if(value < 100) return "warning";
    return "danger";
  };

  // Returning core JSX
  return (
    <div key={mapId}>
      <ActivityCardRow
        boldText={true}
        leftContent={`Activity ID:`}
        centerContent={`Date Submitted:`}
        rightContent={`Awarded XP:`}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
        <div className="leftContent">{request.activityID}</div> 
        <div className="centerContent">{`${request.dateSubmitted}`}</div> 
        <div className="rightContent"><Tag value={request.xpValue} severity={getTagSeverity(request.xpValue)}/></div> 
      </div>
      <ActivityCardRow
        boldText={true}
        leftContent={`Student:`}
        centerContent={`School:`}
        rightContent={`Program:`}
      />
      <ActivityCardRow
        boldText={false}
        leftContent={`${request.studentName}`}
        centerContent={`${request.schoolName}`}
        rightContent={`${request.programName}`}
      />
      <ActivityCardRow
        boldText={true}
        leftContent={`Activity Details`}
        centerContent={``}
        rightContent={``}
      />
      <ActivityCardRow
        boldText={false}
        leftContent={`${request.activityInfo}`}
        centerContent={``}
        rightContent={``}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
        <Button label="Approve" icon="pi pi-check-circle" onClick={() => {}} severity='info' />
        <Button label="View Student" icon="pi pi-search" onClick={() => {}} severity='help'/>
        <Button label="Decline" icon="pi pi-times" onClick={() => {}} severity='warning'/>
      </div>
      <Divider/>
    </div>
  );
};

// Defining the data interface for a activity card row component
interface ActivityCardRowProps {
  boldText: boolean;
  leftContent: string;
  centerContent: string;
  rightContent: string;
};

// React function to render the row card component for the activity request cards
const ActivityCardRow: React.FC<ActivityCardRowProps> = ({boldText, leftContent, centerContent, rightContent}) => {
  // Returning core JSX
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
      {(boldText) ? <div className="leftContent"><b>{leftContent}</b></div> : <div className="leftContent">{leftContent}</div> }
      {(boldText) ? <div className="centerContent"><b>{centerContent}</b></div> : <div className="centerContent">{centerContent}</div> }
      {(boldText) ? <div className="rightContent"><b>{rightContent}</b></div> : <div className="rightContent">{rightContent}</div> }
    </div>
  );
};

export default ActivityRequestCard;
