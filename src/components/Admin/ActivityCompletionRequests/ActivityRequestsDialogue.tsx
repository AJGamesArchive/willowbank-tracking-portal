// Import core functions
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

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

// Type declarations for the activity request filtering system
type FilterMode = {
  name: string;
  key: number;
};

// React function to render the activity completion requests dialogue box
const ActivityCompletionRequestDialogue: React.FC<ActivityCompletionRequestDialogueProps> = ({visible, setVisible, requests}) => {
  // State variable to control the loading state of varying UI components
  const [loading, setLoading] = useState<boolean>(false);

  // State variable to store filtered requests
  const [filteredRequests, setFilteredRequests] = useState<ActivityRequests[]>([]);

  // Variables to control the filtering system
  const [filterMode, setFilterMode] = useState<FilterMode | null>(null)
  const modes: FilterMode[] = [
    {name: "Submission Date", key: 0},
    {name: "School", key: 1},
    {name: "Student", key: 2},
    {name: "Program", key: 3},
  ];
  const [submissionFilter, setSubmissionFilter] = useState<FilterMode | null>(null);
  const submissionFilterOpts: FilterMode[] = [
    {name: "Ascending", key: 0},
    {name: "Descending", key: 1},
  ];
  const [schoolFilter, setSchoolFilter] = useState<FilterMode | null>(null);
  const [schoolFilterOpts, setSchoolFilterOpts] = useState<FilterMode[]>([]);
  const [studentFilter, setStudentFilter] = useState<FilterMode | null>(null);
  const [studentFilterOpts, setStudentFilterOpts] = useState<FilterMode[]>([]);
  const [programFilter, setProgramFilter] = useState<FilterMode | null>(null);
  const [programFilterOpts, setProgramFilterOpts] = useState<FilterMode[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // useEffect hook to handel setting up the initial request filter and filtering options
  useEffect(() => {
    if(visible) {
      setFilteredRequests(requests);
      let scFilter: FilterMode[] = [];
      let scCount: number = 0;
      let sFilter: FilterMode[] = [];
      let sCountL: number = 0;
      let pFilter: FilterMode[] = [];
      let pCount: number = 0;
      requests.forEach((r) => {
        let included: boolean = false;
        scFilter.forEach((f) => {
          if(f.name === r.schoolName) included = true;
        });
        if(!included) {
          scFilter.push({name: r.schoolName, key: scCount});
          scCount++;
        };
        included = false;
        sFilter.forEach((f) => {
          if(f.name === r.studentName) included = true;
        });
        if(!included) {
          sFilter.push({name: r.studentName, key: sCountL});
          sCountL++;
        };
        included = false;
        pFilter.forEach((f) => {
          if(f.name === r.programName) included = true;
        });
        if(!included) {
          pFilter.push({name: r.programName, key: sCountL});
          pCount++;
        };
        setSchoolFilterOpts(scFilter);
        setStudentFilterOpts(sFilter);
        setProgramFilterOpts(pFilter);
      });
    };
  }, [visible]);

  // Function to handel updating states upon the dialogue being hidden
  const onDialogueHide = () => {
    setVisible(false);
  };

  // Const to define the header for the dialogue box
  const header = (
    <React.Fragment>
      <header>Review Activity Completion Requests:</header>
      <div>
        <small style={{color: '#7c7d7e'}}>{`Showing ${filteredRequests.length} out of ${requests.length} requests.`}</small>
        <br/>
        <small style={{color: '#7c7d7e'}}>Filtering:</small>
      </div>
      <div>
      <Dropdown 
        value={filterMode}
        onChange={(e: DropdownChangeEvent) => setFilterMode(e.value)} 
        options={modes}
        optionLabel="name" 
        placeholder="Select a Filter Mode" className="w-full md:w-14rem" 
      />
      <Dropdown 
        value={submissionFilter}
        onChange={(e: DropdownChangeEvent) => setSubmissionFilter(e.value)} 
        options={submissionFilterOpts}
        optionLabel="name" 
        placeholder="Select a Submission Order" className="w-full md:w-14rem" 
      />
      <Dropdown 
        value={schoolFilter}
        onChange={(e: DropdownChangeEvent) => setSchoolFilter(e.value)} 
        options={schoolFilterOpts}
        optionLabel="name" 
        placeholder="Select a School" className="w-full md:w-14rem" 
      />
      <Dropdown 
        value={studentFilter}
        onChange={(e: DropdownChangeEvent) => setStudentFilter(e.value)} 
        options={studentFilterOpts}
        optionLabel="name" 
        placeholder="Select a Student" className="w-full md:w-14rem" 
      />
      <Dropdown 
        value={programFilter}
        onChange={(e: DropdownChangeEvent) => setProgramFilter(e.value)} 
        options={programFilterOpts}
        optionLabel="name" 
        placeholder="Select a Program" className="w-full md:w-14rem" 
      />
      </div>
    </React.Fragment>
  );

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
        header={header}
        modal
        className="p-fluid" 
        onHide={onDialogueHide}
      >
        <Divider/>
        {filteredRequests.map((request, index) => (
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