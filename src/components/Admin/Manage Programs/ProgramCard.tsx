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
  onEditClick: (name: string, description: string, colour: string) => void;
  onDeleteClick: (value: string) => void;
};

// React function to render the login page for mobile devices
const ProgramCard: React.FC<ProgramCardProps> = ({name, description, colour, onProgramClick, onDeleteClick, onEditClick}) => {
  return (
    <>
      <Card title={`${name}`} subTitle={`${description}`} className='card-props'>
        <br/>
        {/* <div className='program-cards-button'>
          <Button label="View Activities" icon="pi pi-search" onClick={() => {onProgramClick(name)}} raised/>
        </div>
        <div className='program-cards-button'>
          <Button severity='info' label="Edit Details" icon="pi pi-pencil" onClick={() => {onProgramClick(name)}} raised/>
        </div>
        <div className='program-cards-button'>
          <Button severity='danger' label="Delete Program" icon="pi pi-trash" onClick={() => {onProgramClick(name)}} raised/>
        </div> */}
        {
          /*
            TODO Decide which button formate to use and remove the unneeded code
          */
        }
        <div className='program-card-button-colum'>
          <p>#{colour}</p>
          <div className='program-card-button-row'>
            <Button icon="pi pi-search" onClick={() => {onProgramClick(name)}} outlined/>
            <Button severity='info' icon="pi pi-pencil" onClick={() => {onEditClick(name, description, colour)}} outlined/>
            <Button severity='danger' icon="pi pi-trash" onClick={() => {onDeleteClick(name)}} outlined/>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProgramCard;
