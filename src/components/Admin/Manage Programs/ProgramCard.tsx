// Import core functions
// --import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

// Import CSS
import './ProgramCard.css'

// Interface to define the props for the Program Details Card
interface ProgramCardProps {
  snowflake: string;
  name: string;
  description: string;
  colour: string;
  onProgramClick: (name: string, snowflake: string) => void;
  onEditClick: (name: string, description: string, colour: string, snowflake: string) => void;
  onDeleteClick: (name: string, snowflake: string) => void;
  lockDelete: boolean;
};

// React function to render the login page for mobile devices
const ProgramCard: React.FC<ProgramCardProps> = ({snowflake, name, description, colour, onProgramClick, onDeleteClick, onEditClick, lockDelete}) => {
  return (
    <>
      <Card title={`${name}`} subTitle={`${description}`} className='card-props'>
        <br/><br/>
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
            <Button icon="pi pi-search" onClick={() => {onProgramClick(name, snowflake)}} outlined/>
            <Button severity='info' icon="pi pi-pencil" onClick={() => {onEditClick(name, description, colour, snowflake)}} outlined/>
            <Button severity='danger' icon="pi pi-trash" onClick={() => {onDeleteClick(name, snowflake)}} disabled={lockDelete} outlined/>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProgramCard;
