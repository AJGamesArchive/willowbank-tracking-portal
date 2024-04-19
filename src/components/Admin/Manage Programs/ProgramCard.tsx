// Import core functions
// --import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

// Import CSS
import './ProgramCard.css'

// Interface to define the props for the Program Details Card
interface ProgramCardProps {
  name: string;
  description: string;
  colour: string;
  onProgramClick: (value: string) => void;
};

// React function to render the login page for mobile devices
const ProgramCard: React.FC<ProgramCardProps> = ({name, description, colour, onProgramClick}) => {
  return (
    <>
      <Card title={`${name}`} subTitle={`${description}`}>
        <p>{colour}</p>
        <div className='program-cards-button'>
          <Button label="View Activities" icon="pi pi-search" onClick={() => {onProgramClick(name)}} raised/>
        </div>
      </Card>
    </>
  );
};

export default ProgramCard;
