// Import core functions
// --import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

// Import CSS
import './ProgramCard.css'

// Importing types
import { ProgramData } from '../../../types/Admin/ProgramData';

// Interface to define the props for the Program Details Card
interface ProgramCardProps {
  data: ProgramData;
  onProgramClick: (name: string, snowflake: string) => void;
  onEditClick: (data: ProgramData) => void;
  onDeleteClick: (name: string, snowflake: string) => void;
  lockDelete: boolean;
};

// React function to render the login page for mobile devices
const ProgramCard: React.FC<ProgramCardProps> = ({data, onProgramClick, onDeleteClick, onEditClick, lockDelete}) => {
  return (
    <>
      <Card title={`${data.name}`} subTitle={`${data.description}`} className='card-props'>
        <br/><br/>
        <div className='program-card-button-colum'>
          <p>#{data.colour}</p>
          <div className='program-card-button-row'>
            <Button icon="pi pi-search" onClick={() => {onProgramClick(data.name, data.snowflake)}} outlined/>
            <Button severity='info' icon="pi pi-pencil" onClick={() => {onEditClick(data)}} outlined/>
            <Button severity='danger' icon="pi pi-trash" onClick={() => {onDeleteClick(data.name, data.snowflake)}} disabled={lockDelete} outlined/>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProgramCard;
