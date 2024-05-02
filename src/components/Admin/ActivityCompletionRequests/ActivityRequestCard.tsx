// Import core functions
import React from 'react';
import { useRef, useState } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

// Import types
import { ActivityRequests } from '../../../types/Global/ActivityCompletionRequests';

// Import CSS
import './ActivityRequestCard.css'

// Import functions
import { processActivityRequests } from '../../../functions/Admin/ActivityRequests/ProcessRequest';

export type Actioned = {
  activityId: number;
  studentSnowflake: string;
  programSnowflake: string;
};

// Defining data interface for the activity requests card
interface ActivityRequestCardProps {
  request: ActivityRequests;
  mapId: number;
  onActioned: (id: Actioned) => void;
};

// React function to render the activity request card for the activity requests dialogue box
const ActivityRequestCard: React.FC<ActivityRequestCardProps> = ({request, mapId, onActioned}) => {
  // State variable to control the loading state of varying UI components
  const [loading, setLoading] = useState<boolean>(false);

  // State variables to control confirmation dialogue boxes
  const [confirmApproval, setConfirmApproval] = useState<boolean>(false);
  const [confirmDecline, setConfirmDecline] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function to handel approving activity completion requests
  //TODO Make this function
  async function approveRequestHandler(): Promise<void> {
    setLoading(true);

    toast.current?.show({
      severity: 'info',
      summary: 'Feature Not Implemented',
      detail: `Sorry but this feature has not been implemented yet. Please come back later.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });

    setLoading(false);
  };

  // Async function to handel declining activity completion requests
  async function declineRequestHandler(): Promise<void> {
    setLoading(true);
    const success: boolean = await processActivityRequests(request);
    if(success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Activity Request Declined',
        detail: `The activity completion request has been declined successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      onActioned({
        activityId: request.activityID,
        studentSnowflake: request.studentSnowflake,
        programSnowflake: request.programSnowflake,
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Unexpected Error',
        detail: `An unexpected error occurred while trying to process the activity request. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    setLoading(false);
    setConfirmDecline(false);
    return;
  };
  
  // Function to set the XP tag severity
  const getTagSeverity = (value: number) => {
    if(value < 50) return "success";
    if(value < 100) return "warning";
    return "danger";
  };

  // Template to define the footer of the delete a single activity dialogue box
  const confirmApprovalFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" severity='secondary' onClick={() => setConfirmApproval(false)} />
      <Button label="Approve" loading={loading} icon="pi pi-check" severity="success" onClick={approveRequestHandler} />
    </React.Fragment>
  );

  // Template to define the footer of the delete a single activity dialogue box
  const confirmDeclineFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" severity='secondary' onClick={() => setConfirmDecline(false)} />
      <Button label="Decline" loading={loading} icon="pi pi-exclamation-triangle" severity="danger" onClick={declineRequestHandler} />
    </React.Fragment>
  );

  // Returning core JSX
  return (
    <div key={mapId}>
      <Toast ref={toast}/>

      <Dialog 
        visible={confirmApproval} 
        resizable={false} 
        draggable={false} 
        closeIcon='pi pi-times' 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Confirm Approval" 
        modal 
        footer={confirmApprovalFooter} 
        onHide={() => {setConfirmApproval(false)}}
        closeOnEscape={(loading) ? false : true}
        closable={(loading) ? false : true}
      >
        <div>
          <p>Are you sure you want to confirm approval of this activity?</p>
        </div>
      </Dialog>

      <Dialog 
        visible={confirmDecline} 
        resizable={false} 
        draggable={false} 
        closeIcon='pi pi-times' 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header="Confirm Approval" 
        modal 
        footer={confirmDeclineFooter} 
        onHide={() => {setConfirmDecline(false)}}
        closeOnEscape={(loading) ? false : true}
        closable={(loading) ? false : true}
      >
        <div>
          <p>Are you sure you want to decline this activity request?</p>
        </div>
      </Dialog>

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
        <Button label="Approve" icon="pi pi-check-circle" onClick={() => {setConfirmApproval(true)}} loading={loading} severity='info' />
        <Button label="View Student" icon="pi pi-search" onClick={() => {
          toast.current?.show({
            severity: 'info',
            summary: 'Feature Not Implemented',
            detail: `Sorry but this feature has not been implemented yet. Please come back later.`,
            closeIcon: 'pi pi-times',
            life: 7000,
          });
        }} severity='help'/>
        <Button label="Decline" icon="pi pi-times" onClick={() => {setConfirmDecline(true)}} loading={loading} severity='warning'/>
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
