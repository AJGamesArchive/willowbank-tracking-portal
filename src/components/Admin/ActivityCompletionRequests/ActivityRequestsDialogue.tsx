// Import core functions
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// Import types
import { ActivityRequests } from '../../../types/Global/ActivityCompletionRequests';
import { Actioned } from './ActivityRequestCard';

// Import CSS
import './ActivityRequestsDialogue.css'

// Import UI components
import ActivityRequestCard from './ActivityRequestCard';
import { Divider } from 'primereact/divider';

// Defining data interface for the ActivityCompletionRequestDialogue Props
interface ActivityCompletionRequestDialogueProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  baseRequests: ActivityRequests[];
};

// Type declarations for the activity request filtering system
type FilterMode = {
  name: string;
  key: number;
};

// React function to render the activity completion requests dialogue box
const ActivityCompletionRequestDialogue: React.FC<ActivityCompletionRequestDialogueProps> = ({visible, setVisible, baseRequests}) => {
  // State variable to store filtered requests
  const [filteredRequests, setFilteredRequests] = useState<ActivityRequests[]>([]);

  // State variable to store current pending requests
  var [requests, setRequests] = useState<ActivityRequests[]>([]);

  // State variable to handel refreshing the pending activities array
  const [actionedID, setActionedID] = useState<Actioned | null>(null)

  // Variables to control the filtering system
  const [filterMode, setFilterMode] = useState<FilterMode>({name: "Submission Date", key: 0})
  const modes: FilterMode[] = [
    {name: "Submission Date", key: 0},
    {name: "School", key: 1},
    {name: "Student", key: 2},
    {name: "Program", key: 3},
  ];
  const [submissionFilter, setSubmissionFilter] = useState<FilterMode>({name: 'Ascending', key: 0});
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

// useEffect hook to update the displayed requests based on given filters
  useEffect(() => {
    if(actionedID !== null) {
      let updatedRequests: ActivityRequests[] = [];
      requests.forEach((r) => {
        if(r.activityID !== actionedID.activityId || r.studentSnowflake !== actionedID.studentSnowflake || r.programSnowflake !== actionedID.programSnowflake) updatedRequests.push(r);
      });
      setRequests(updatedRequests);
      setActionedID(null);
    };
    switch(filterMode.key) {
      case 1:
        // Filter by school name
        if(schoolFilter === null) return;
        let filteredSchoolArray: ActivityRequests[] = [];
        requests.forEach((r) => {
          if(r.schoolName === schoolFilter.name) filteredSchoolArray.push(r);
        });
        setFilteredRequests(filteredSchoolArray);
        break;
      case 2:
        // Filter by student name
        if(studentFilter === null) return;
        let filteredStudentArray: ActivityRequests[] = [];
        requests.forEach((r) => {
          if(r.studentName === studentFilter.name) filteredStudentArray.push(r);
        });
        setFilteredRequests(filteredStudentArray);
        break;
      case 3:
        // Filter by program name
        if(programFilter === null) return;
        let filteredProgramArray: ActivityRequests[] = [];
        requests.forEach((r) => {
          if(r.programName === programFilter.name) filteredProgramArray.push(r);
        });
        setFilteredRequests(filteredProgramArray);
        break;
      default:
        switch(submissionFilter.key) {
          case 0:
            // Filtered requests by submission date in ascending order
            setFilteredRequests(requests);
            break;
          case 1:
            // Filtered requests by submission date in descending order
            let filteredArray: ActivityRequests[] = [];
            for(let i = requests.length - 1; i >= 0; i--) {
              filteredArray.push(requests[i]);
            };
            setFilteredRequests(filteredArray);
            break;
        };
        break;
    };
  }, [actionedID, filterMode, submissionFilter, schoolFilter, studentFilter, programFilter]);

  // useEffect hook to handel setting up the initial request filter and filtering options
  useEffect(() => {
    if(visible) {
      setRequests(baseRequests);
      setFilteredRequests(baseRequests);
      let scFilter: FilterMode[] = [];
      let scCount: number = 0;
      let sFilter: FilterMode[] = [];
      let sCountL: number = 0;
      let pFilter: FilterMode[] = [];
      let pCount: number = 0;
      baseRequests.forEach((r) => {
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
      <div style={{paddingTop: '2px'}}>
        <small>Filtering:</small>
      </div>
      <div className="p-inputgroup flex-1">
        <Dropdown 
          value={filterMode}
          onChange={(e: DropdownChangeEvent) => setFilterMode(e.value)}
          options={modes}
          optionLabel="name" 
          placeholder="Select a Filter Mode" className="w-full md:w-14rem" 
        />
        {filterMode.key === 0 && <Dropdown 
          value={submissionFilter}
          onChange={(e: DropdownChangeEvent) => setSubmissionFilter(e.value)} 
          options={submissionFilterOpts}
          optionLabel="name" 
          placeholder="Select a Submission Order" className="w-full md:w-14rem" 
        />}
        {filterMode.key === 1 && <Dropdown 
          value={schoolFilter}
          onChange={(e: DropdownChangeEvent) => setSchoolFilter(e.value)} 
          options={schoolFilterOpts}
          optionLabel="name" 
          placeholder="Select a School" className="w-full md:w-14rem" 
        />}
        {filterMode.key === 2 && <Dropdown 
          value={studentFilter}
          onChange={(e: DropdownChangeEvent) => setStudentFilter(e.value)} 
          options={studentFilterOpts}
          optionLabel="name" 
          placeholder="Select a Student" className="w-full md:w-14rem" 
        />}
        {filterMode.key === 3 && <Dropdown 
          value={programFilter}
          onChange={(e: DropdownChangeEvent) => setProgramFilter(e.value)} 
          options={programFilterOpts}
          optionLabel="name" 
          placeholder="Select a Program" className="w-full md:w-14rem" 
        />}
      </div>
      <small>{`Showing ${filteredRequests.length} out of ${requests.length} requests.`}</small>
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
        closeOnEscape={false}
        className="p-fluid" 
        onHide={onDialogueHide}
      >
        <Divider/>
        {filteredRequests.map((request, index) => (
          <ActivityRequestCard
            request={request}
            mapId={index}
            onActioned={setActionedID}
            feedbackCallback={(message: ToastMessage) => toast.current?.show(message)}
          />
        ))}
      </Dialog>
    </>
  );
};

export default ActivityCompletionRequestDialogue;