import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";

//Import CSS
import './StudentSchoolData.css';

//Import Types
import { SchoolTimeSlot } from "../../types/Schools/SchoolTimeSlot";

interface StudentTimetable {
    schoolName: string,
    timetable: SchoolTimeSlot[]
}

//React function to render the add school form
const DisplaySchoolData: React.FC<StudentTimetable> = ({schoolName , timetable}) => {

    const schoolSection = (
        <div>
            <h1>Timetable for {schoolName}</h1>
            <DataTable 
                value={timetable}
                tableStyle={{ minWidth: '50rem' }}>
                    <Column field="day" header="Day"></Column>
                    <Column field="startTime" header="Start Time"></Column>
                    <Column field="endTime" header="End Time"></Column>
            </DataTable>
        </div>
    );

    return (
        schoolSection
    )
}

export default DisplaySchoolData;