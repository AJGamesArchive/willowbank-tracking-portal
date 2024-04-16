import './admin.css';
import React from 'react';

// Import primereact features
import { Card } from "primereact/card"

// Declare parameter types for Badge
interface IAdmin {
    title: string;
    description: string;
    destinationPage: string;
}

const AdminCard : React.FC<IAdmin> = ({title, description, destinationPage}) => {
    return <Card
        className="student-badge" 
        onClick={() => { window.location.href = destinationPage;}}>
        <h2>{title}</h2>
        <p>{description}</p>
    </Card>
}

export default AdminCard;