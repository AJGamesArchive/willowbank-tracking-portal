// Import core functions
// --import { useState } from 'react';
import { Card } from 'primereact/card';

// Import CSS
import './ProgramCard.css'

// Interface to define the props for the Program Details Card
interface ProgramCardProps {
  name: string;
  description: string;
  colour: string;
};

// React function to render the login page for mobile devices
const ProgramCard: React.FC<ProgramCardProps> = ({name, description, colour}) => {
  return (
    <>
      <Card title={`${name}`} subTitle={`${description}`}>
        <p>{colour}</p>
      </Card>
    </>
  );
};

export default ProgramCard;
