// Import core functions
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';

// Import CSS
import './StudentPrograms.css'

// Import types
import { XPStudentAccountDetails } from '../../types/Global/UserAccountDetails';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';

// Defining the data interface for the student program card
interface StudentProgramProps {
  programSnowflake: string;
  image: string;
  title: string;
  description: string;
  colour: string;
  textColour: string;
  progress: XPStudentAccountDetails;
  fetchAndFilterActivities: (snowflake: string, programName: string) => void;
  lockButton: boolean;
};

// React function to render the student programs component for the student portal
const StudentProgram: React.FC<StudentProgramProps> = ({programSnowflake, title, description, colour, textColour, progress, fetchAndFilterActivities, lockButton}) => {
  // Defining state variable to handle program process
  const [progressPercentage] = useState<number>(((progress.currentXP - progress.previousTargetXP) / (progress.targetXP - progress.previousTargetXP) * 100));
  const [programPopupVisible, setProgramPopupVisible] = useState<boolean>(false);
  
  // Defining card header template
  const cardHeader = (
    <div style={{backgroundColor: `#${colour}`}}>
      <img style={{ width: '100%', filter:`brightness(${getBrightness()})`}} src={getSRC()} alt='Program image'/>
    </div>
  );
  
  function getSRC ()
  {
    const filename = title.replace(/\s/g, "").toLowerCase();
    return `/assets/program-images/${filename}.png`
  }

  function getBrightness()
  {
    if (textColour == "Black") { return 0 }
    return 100
  }

  const programPopup = (
    <Dialog className="program-popup" header={title} onHide={() => {setProgramPopupVisible(false)}} visible={programPopupVisible} closeIcon="pi pi-times"> <p>{description}</p>  </Dialog>
  );
  // Defining card footer template
  const cardFooter = (
    <>
      <Button className="program-button" label="Badges"       icon="pi pi-star" severity="success"    />
      <Button className="program-button" label="Activities"   icon="pi pi-list" severity="info"       onClick={() => fetchAndFilterActivities(programSnowflake, title)} loading={lockButton}  />
      <Button className="program-button" label="Program Info" icon="pi pi-book" severity="secondary"  onClick={() => {setProgramPopupVisible(true)}}/>
    </>
  );

  // Defining the program progress template for the progress bar
  const programProcess = () => {
    return (
      <React.Fragment>
        {progressPercentage}%
      </React.Fragment>
    );
  };

  // Returning core JSX
  return (
    <Card header={cardHeader} footer={cardFooter} role={"[Program Name] Program Card"} className='progress-card'>
      {programPopup}
      <div className='progress-card-content'>
        <div style={{fontSize: "xx-large"}}><b>{title}</b></div>
        <Divider/>
        <StudentProgramRow
          boldText={true}
          leftContent={`Badges Awarded:`}
          centerContent={` `}
          rightContent={`Date Started:`}
        />
        <StudentProgramRow
          boldText={false}
          leftContent={`${progress.currentLevel - 1}`}
          centerContent={` `}
          rightContent={`${progress.dateStarted}`}
        />
        <Divider />
        <StudentProgramRow
          boldText={true}
          leftContent={`Current Level: \n`}
          centerContent={`Current XP:`}
          rightContent={`Next Level:`}
        />
        <StudentProgramRow
          boldText={false}
          leftContent={`Lvl ${progress.currentLevel}:`}
          centerContent={`${progress.currentXP}xp / ${progress.targetXP}xp`}
          rightContent={`Lvl ${progress.currentLevel + 1}:`}
        />
        <StudentProgramRow
          boldText={false}
          leftContent={`${progress.previousTargetXP}xp`}
          centerContent={``}
          rightContent={`${progress.targetXP}xp`}
        />
        <ProgressBar value={progressPercentage} displayValueTemplate={programProcess}/>
      </div>
    </Card>
  );
};

// Defining the data interface for a student program card row component
interface StudentProgramRowProps {
  boldText: boolean;
  leftContent: string;
  centerContent: string;
  rightContent: string;
};

// React function to render the row card component for the student program cards
const StudentProgramRow: React.FC<StudentProgramRowProps> = ({boldText, leftContent, centerContent, rightContent}) => {
  // Returning core JSX
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
      {(boldText) ? <div className="leftContent"><b>{leftContent}</b></div> : <div className="leftContent">{leftContent}</div> }
      {(boldText) ? <div className="centerContent"><b>{centerContent}</b></div> : <div className="centerContent">{centerContent}</div> }
      {(boldText) ? <div className="rightContent"><b>{rightContent}</b></div> : <div className="rightContent">{rightContent}</div> }
    </div>
  );
};

export default StudentProgram;