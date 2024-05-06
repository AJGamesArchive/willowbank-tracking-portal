// Import core UI components
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// Import UI components
import Badge from '../../../components/StudentHome/Badge';

// Import global parameters
import { GlobalParams } from '../../../interfaces/GlobalParams';
import { useParams } from 'react-router';
import { BadgeFiltersParams } from '../../../interfaces/BadgeFilters';

// Import CSS
import './ViewAllBadgesDesktop.css'
import './ViewAllBadgesGlobal.css'

// Import functions
import { confirmLogin } from '../../../functions/Global/ConfirmLogin';
import { retrieveStudentData } from '../../../functions/Student/RetrieveStudentData';
import { retrieveProgramData } from '../../../functions/Admin/ManagePrograms/RetrieveProgramData';

// Import types
import { BadgeData } from '../../../types/Global/Badges';
import { ProgramData } from '../../../types/Admin/ProgramData';
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Defining the data type for counting program occurrences
type CountingPrograms = {
  programName: string;
  programColour: string;
  counter: number;
  percentage: number;
};

type CoreFilterOpts = {
  name: string;
  key: number;
};

// React function to render the view all badges page for desktop devices
const ViewBadgesDesktop: React.FC = () => {
  // Setting up global params on this page
  const params = useParams<GlobalParams>();
  const filterDefaults = useParams<BadgeFiltersParams>();

  // Variable to force confirmation of the account login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State variables to store badges
  const [allBadges, setBadges] = useState<BadgeData[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<BadgeData[]>([]);

  const [coreFilterOpts] = useState<CoreFilterOpts[]>([
    {name: "Show All Badges", key: 0},
    {name: "Filter By Program", key: 1},
  ]);
  const [selectedFilter, setSelectedFilter] = useState<CoreFilterOpts>((filterDefaults.mode !== 'a') ? {name: "Filter By Program", key: 1} : {name: "Show All Badges", key: 0})

  const [orderOpts] = useState<CoreFilterOpts[]>([
    {name: "Newest", key: 0},
    {name: "Oldest", key: 1},
  ]);
  const [selectedOrder, setSelectedOrder] = useState<CoreFilterOpts>((filterDefaults.filter !== 'n') ? {name: "Oldest", key: 1} : {name: "Newest", key: 0});

  const [selectedProgram, setSelectedProgram] = useState<ProgramData>();
  const [programs, setPrograms] = useState<ProgramData[]>([]);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Function to setup the initial badge card renders
  function setupInitialRender(studentData: CoreStudentAccountDetails, programData: ProgramData[]): void {
    // Define default badge listings is invalid params are passed
    let defaultBadgeList: BadgeData[] = [...studentData.badges];
    defaultBadgeList.reverse();
    // Setup the default badge list if invalid params are passed
    if(typeof filterDefaults.mode !== "string" || typeof filterDefaults.filter !== "string") {
      setFilteredBadges(defaultBadgeList);
      return;
    };
    switch(filterDefaults.mode) {
      case "p":
        const programParam: string = filterDefaults.filter.replace(/-/g, ' ');
        let foundProgram: boolean = false;
        programData.forEach((p) => {
          if(p.name === programParam) {
            let fetchBadges: BadgeData[] = [];
            studentData.badges.forEach((b) => {
              if(b.programSnowflake === p.snowflake) fetchBadges.push(b);
            });
            fetchBadges.reverse();
            setFilteredBadges(fetchBadges);
            foundProgram = true;
          };
        });
        if(!foundProgram) setSelectedProgram(programData[0]);
        return;
      default:
        switch(filterDefaults.filter) {
          case "o":
            setFilteredBadges(studentData.badges);
            return;
          default:
            setFilteredBadges(defaultBadgeList);
            return;
        };
    };
  };

  // Event handler to perform action upon initial render
  useEffect(() => {
    async function confirmLoginHandler() {
      // Validate login
      const confirmed: boolean = await confirmLogin("students", params.snowflake, params.token);
      if (!confirmed) { window.location.href = `/home`; }

      // Retrieve all student and badge data
      const studentData = await retrieveStudentData((params.snowflake? params.snowflake : ''));
      const programData = await retrieveProgramData();
      if(typeof studentData === "string" || typeof programData === "string") {
        toast.current?.show({
          severity: 'warn',
          summary: 'Missing Data',
          detail: `Some or all data required for this page could not be loaded. As a result, some compCoreonents may not display properly and some actions will be incompletable. Refresh the page to try again.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
        setIsLoggedIn(true); return;
      };
      // Save badge data
      setBadges(studentData.badges);
      setPrograms(programData);
      if(filterDefaults.mode === "p" && typeof filterDefaults.filter === "string") {
        const programParam: string = filterDefaults.filter.replace(/-/g, ' ');
        let foundProgram: boolean = false;
        programData.forEach((p) => {
          if(p.name === programParam) {setSelectedProgram(p); foundProgram = true;}
        });
        if(!foundProgram) setSelectedProgram(programData[0]);
      } else {
        setSelectedProgram(programData[0]);
      };

      setupInitialRender(studentData, programData);

      //* Calculating data to power meter group
      // Calculate badges as percentages of programs
      let countPrograms: CountingPrograms[] = [];
      studentData.badges.forEach((b) => {
        let logged: boolean = false;
        countPrograms.forEach((p) => {
          if(p.programName === b.awardedProgram) {
            logged = true;
            p.counter++;
          };
        });
        if(!logged) {
          countPrograms.push({
            programName: b.awardedProgram,
            programColour: b.colour,
            counter: 1,
            percentage: 0,
          });
        };
      });
      setIsLoggedIn(true); return;
    };
    confirmLoginHandler();
  }, []); // Emptying process array to ensure handler only runs on initial render

  // Function to switch the filter mode selected
  const onFilterModeChange = (e: DropdownChangeEvent) => {
    const filter: CoreFilterOpts = e.value;
    setSelectedFilter(e.value);
    if(filter.key === 0) {
      let reversedBadges: BadgeData[] = [...allBadges];
      reversedBadges.reverse();
      setFilteredBadges(reversedBadges);
      setSelectedOrder({name: "Newest", key: 0});
    } else {
      let fetchBadges: BadgeData[] = [];
      allBadges.forEach((b) => {
        if(b.programSnowflake === programs[0].snowflake) fetchBadges.push(b);
      });
      fetchBadges.reverse();
      setFilteredBadges(fetchBadges);
      setSelectedProgram(programs[0]);
    };
    return;
  };

  // Function to handel the filter options changing
  const onFilterChange = (e: DropdownChangeEvent) => {
    const filter: ProgramData = e.value;
    setSelectedProgram(e.value);
    let fetchBadges: BadgeData[] = [];
    allBadges.forEach((b) => {
      if(b.programSnowflake === filter.snowflake) fetchBadges.push(b);
    });
    fetchBadges.reverse();
    setFilteredBadges(fetchBadges);
    return;
  };

  // Function to handel changing the order that all badges are displayed (Newest or Oldest first)
  const onOrderChange = (e: DropdownChangeEvent) => {
    const filter: CoreFilterOpts = e.value;
    setSelectedOrder(e.value);
    if(filter.key === 0) {
      let reversedBadges: BadgeData[] = [...allBadges];
      reversedBadges.reverse();
      setFilteredBadges(reversedBadges);
    } else {
      setFilteredBadges(allBadges);
    };
    return;
  };

  // Return JSX based on login state
  if (isLoggedIn) {
    return (
      <>
        <Toast ref={toast}/>
        <h1>Here's all your awarded badges {params.name}!</h1>
        <Divider/>
        <div className='badge-filter-bar'>
          <Dropdown 
            value={selectedFilter}
            onChange={(e: DropdownChangeEvent) => onFilterModeChange(e)}
            options={coreFilterOpts}
            optionLabel="name" 
            placeholder="Select a Program" className="w-full md:w-14rem" 
          />
          {selectedFilter.name === "Show All Badges" && <div>
            <Dropdown 
              value={selectedOrder}
              onChange={(e: DropdownChangeEvent) => onOrderChange(e)}
              options={orderOpts}
              optionLabel="name" 
              placeholder="Select a Program" className="w-full md:w-14rem" 
            />
          </div>}
          {selectedFilter.name === "Filter By Program" && <div>
            <Dropdown 
              value={selectedProgram}
              onChange={(e: DropdownChangeEvent) => onFilterChange(e)}
              options={programs}
              optionLabel="name" 
              placeholder="Select a Program" className="w-full md:w-14rem" 
            />
          </div>}
        </div>
        <Divider/>
        <div className="student-badge-grid-container">
          {filteredBadges.map((badge, index) => (
            <div className='student-badge-grid-item'>
              <Badge
                badge={badge}
                id={index}
              />
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return (
      <>
        <Toast ref={toast}/>
        <ProgressSpinner/>
      </>
    );
  };
};

export default ViewBadgesDesktop;