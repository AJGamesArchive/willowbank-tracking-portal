// Import core functions
// --import { useState } from 'react';

// Import CSS
import './TeacherCard.css';

// Import primereact features
import { Card } from "primereact/card"


interface ITeacher {
    title: string;
    description: string;
    destinationPage: string;
}

// React function to render the login page for mobile devices
const TeacherCard: React.FC<ITeacher> = ({title, description, destinationPage}) => {
  return (
        <Card

        className="student-badge"
        onClick={() => { window.location.href = destinationPage;}}>
        <h2>{title}</h2>
        <p>{description}</p>
        </Card>
    );

};

export default TeacherCard;
