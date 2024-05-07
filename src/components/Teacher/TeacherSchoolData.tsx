import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";

//Import CSS
import './TeacherSchoolData.css';

//Import Types
import { SchoolTimeSlot } from "../../types/Schools/SchoolTimeSlot";

interface TeacherTimetable {
    schoolName: string;
    timetable: SchoolTimeSlot[];
    index: number;
}

//React function to render the add school form
const TeacherSchoolData: React.FC<TeacherTimetable> = ({schoolName , timetable, index}) => {

    const schoolSection = (
        <div key={index}>
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

    return schoolSection;
}

export default TeacherSchoolData;