// Import core functions
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

// Import types
import { ActivityRequests } from '../../../types/Global/ActivityCompletionRequests';

// Import CSS
import './ActivityRequestsDialogue.css'

// Import UI components
import ActivityRequestCard from './ActivityRequestCard';
import { Divider } from 'primereact/divider';

// Defining data interface for the ActivityCompletionRequestDialogue Props
interface ActivityCompletionRequestDialogueProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  requests: ActivityRequests[];
};

// React function to render the activity completion requests dialogue box
const ActivityCompletionRequestDialogue: React.FC<ActivityCompletionRequestDialogueProps> = ({visible, setVisible, requests}) => {
  // State variable to control the loading state of varying UI components
  const [loading, setLoading] = useState<boolean>(false);

  // State variable to store filtered requests
  const [filteredRequests, setFilteredRequests] = useState<ActivityRequests[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // useEffect hook to handel setting up the initial request filter and filtering options
  useEffect(() => {
    if(visible) {
      setFilteredRequests(requests);
      //TODO Add initial filtering defaults here
    };
  }, [visible]);

  // Function to handel updating states upon the dialogue being hidden
  const onDialogueHide = () => {
    setVisible(false);
  };

  // Returning core JSX
  return (
    <>
      <Toast ref={toast}/>
      <Dialog 
        visible={visible} 
        resizable={false} 
        draggable={false} 
        closeIcon='pi pi-times' 
        style={{ width: '38rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`[Activity_Completion_Requests_Placeholder]`} 
        modal
        className="p-fluid" 
        onHide={onDialogueHide}
      >
        <Divider/>
        {requests.map((request, index) => (
          <ActivityRequestCard
            request={request}
            mapId={index}
          />
        ))}
      </Dialog>
    </>
  );
};

export default ActivityCompletionRequestDialogue;