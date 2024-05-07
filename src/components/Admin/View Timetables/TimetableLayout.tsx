import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { SchoolTimeSlot } from '../../../types/Schools/SchoolTimeSlot';

interface SchoolInfo {
    schoolName: string,
    schoolCode: string,
    schoolEmail: string,
    schoolPhone: string,
    timetable: SchoolTimeSlot[];
    index: number;
}

//React function to render the add school form
const TimetableLayout: React.FC<SchoolInfo> = ({schoolName, schoolCode, schoolEmail, schoolPhone, timetable,index}) => {

    const displaySchoolDetails = (
        <div key={index}>
            <h2>Details for: {schoolName}</h2>
            <h5>School Code: {schoolCode}</h5>
            <h5>School Email: {schoolEmail}</h5>
            <h5>School Phone: {schoolPhone}</h5>

            <DataTable 
                value={timetable}
                tableStyle={{ minWidth: '50rem' }}>
                    <Column field="day" header="Day"></Column>
                    <Column field="startTime" header="Start Time"></Column>
                    <Column field="endTime" header="End Time"></Column>
            </DataTable>
        </div>
    );

    return displaySchoolDetails;

};

export default TimetableLayout;