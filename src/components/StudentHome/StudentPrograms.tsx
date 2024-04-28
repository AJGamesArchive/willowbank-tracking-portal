// Import core functions
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';

// Import CSS
import './StudentPrograms.css'

// Import types
import { XPStudentAccountDetails } from '../../types/Global/UserAccountDetails';

// Defining the data interface for the student program card
interface StudentProgramProps {
  image: string;
  title: string;
  description: string;
  colour: string;
  progress: XPStudentAccountDetails;
  setVisibleActivities: (value: boolean) => void;
  //TODO Add props for the button functions
};

// React function to render the student programs component for the student portal
const StudentProgram: React.FC<StudentProgramProps> = ({image, title, description, colour, progress, setVisibleActivities}) => {
  // Defining state variable to handel program process
  const [progressPercentage] = useState<number>(((progress.currentXP - progress.previousTargetXP) / (progress.targetXP - progress.previousTargetXP) * 100));

  // Defining card header template
  const cardHeader = (
    <img alt="ProgramImage" src={image} style={{ width: '100%', height: 'auto' }}/>
  );
  
  // Defining card footer template
  const cardFooter = (
    <>
      <Button label="View Activities" icon="pi pi-list" severity="info" onClick={() => setVisibleActivities(true)}/>
      <Button label="Awarded Badges" severity="success" icon="pi pi-star" style={{ margin: '0.5em' }} />
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
    <Card title={title} subTitle={description} header={cardHeader} footer={cardFooter} role={"[Program Name] Program Card"} className='progress-card'>
      <div className='progress-card-content'>
        <div style={{color: `#${colour}`}}><b>My Journey</b></div>
        <StudentProgramRow
          boldText={true}
          leftContent={`Badges Awarded:`}
          centerContent={` `}
          rightContent={`Date Started:`}
        />
        <StudentProgramRow
          boldText={false}
          leftContent={`${progress.currentLevel}`}
          centerContent={` `}
          rightContent={`${progress.dateStarted}`}
        />
        <StudentProgramRow
          boldText={true}
          leftContent={`Current Level:`}
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
      {(boldText) ? <div style={{ textAlign: 'left' }}><b>{leftContent}</b></div> : <div style={{ textAlign: 'left' }}>{leftContent}</div> }
      {(boldText) ? <div style={{ textAlign: 'center' }}><b>{centerContent}</b></div> : <div style={{ textAlign: 'center' }}>{centerContent}</div> }
      {(boldText) ? <div style={{ textAlign: 'right' }}><b>{rightContent}</b></div> : <div style={{ textAlign: 'right' }}>{rightContent}</div> }
    </div>
  );
};

export default StudentProgram;