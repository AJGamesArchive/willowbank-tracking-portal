// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { confirmDialog } from 'primereact/confirmdialog';
import { Messages } from 'primereact/messages';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { Dropdown } from 'primereact/dropdown';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

//Import CSS
import './AddSchoolForm.css';
import { mask } from 'primereact/utils';

//React function to render the add school form
const AddSchoolForm: React.FC = () => {
    //Variables to store the required school details
    const [schoolName, setSchoolName] = useState<string>("");
    const [schoolCode, setSchoolCode] = useState<any>(null);
    const [schoolPhone, setSchoolPhone] = useState<string>("");
    const [schoolEmail, setSchoolEmail] = useState<string>("");
    const [schoolTimeTo, setSchoolTimeTo] = useState<Date>();
    const [schoolTimeFrom, setSchoolTimeFrom] = useState<Date>();
    const [schoolTimes, setSchoolTimes] = useState<any[]>([]);

    //Variables to control toast messages
    const toast = useRef<Toast>(null);


 const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

 const [day, setDay] = useState<string>("");

function schoolTimeValidator(): void {

    const inputValidationError = (type: any, title: string, message: string) => {
        toast.current?.show({
            severity: type,
            summary: `${title}`,
            detail: `${message}`,
            closeIcon: 'pi pi-times',
            life: 7000,
        });
    }

    if (day === "") {
        inputValidationError("error", "No day selected", "Please select a day before adding to list.")
    }

    if (schoolTimeTo === null)
    {
        inputValidationError("error", "No day selected", "Please select a day before adding to list.")
    }
}

    // Return JSX
    return (

        //Create the form to add a new school
        <Card title={"Add New School"}>

            
            <div className="school_creation_form_field">
                <span className="p-float-label">
                    <InputText
                        id="set_school_name"
                        value={schoolName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value.toUpperCase())}
                        required
                    />
                    <label htmlFor="set_school_name">School Name</label> 
                </span>
            </div>
            <small id="new_school_name_help" className='school_creation-form-help'>
                Enter the school's name.
            </small>

            <div className="school_creation_form_field">
                <span className="p-float-label">
                    <InputMask
                        id="set_school_code"
                        value={schoolCode}
                        onChange={(e: InputMaskChangeEvent) => {
                        setSchoolCode(e.target.value);
                        }}
                        mask="99-99-99"
                        slotChar="00-00-00"
                    />
                    <label htmlFor="set_school_code">School Code</label> 
                </span>
            </div>
            <small id="new_school_code_help" className='school_creation-form-help'>
                Enter a unique school code.
            </small>

            <div className="school_creation_form_field">
                <span className="p-float-label">
                    <InputText
                        id="set_school_email"
                        value={schoolEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolEmail(e.target.value.toUpperCase())}
                        required
                        keyfilter="email"
                    />
                    <label htmlFor="set_school_email">School Email</label> 
                </span>
            </div>
            <small id="new_school_email_help" className='school_creation-form-help'>
                Enter the school's contact email.
            </small>

            <div className="school_creation_form_field">
                <span className="p-float-label">
                    <InputText
                        id="set_school_phone"
                        value={schoolPhone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolPhone(e.target.value.toUpperCase())}
                        required
                    />
                    <label htmlFor="set_school_phone">School Phone</label> 
                </span>
            </div>
            <small id="new_school_phone_help" className='school_creation-form-help'>
                Enter the school's phone number.
            </small>

            <div className="school_creation_form_field">
                <span className="school_creation_time_container">
                   <Dropdown value={day} onChange={(e) => setDay(e.value)} options={daysOfWeek}/>
                   <p className= "school_creation_time_components">From:</p>
                   <Calendar className= "school_creation_time_components" value={schoolTimeFrom} onChange={(e) => setSchoolTimeFrom(e.value)} timeOnly incrementIcon = "pi pi-angle-up" decrementIcon = "pi pi-angle-down"/>
                   <p className= "school_creation_time_components">To:</p>
                   <Calendar className= "school_creation_time_components" value={schoolTimeTo} onChange={(e) => setSchoolTimeTo(e.value)} timeOnly incrementIcon = "pi pi-angle-up" decrementIcon = "pi pi-angle-down" />
                   <Button className="school_creation_time_components" label="Add Timing"
                    onClick={() => {
                        schoolTimeValidator();
                    }}
                   />
                </span>
            </div>
            <small id="new_school_time_help" className='school_creation-form-help'>
                Enter the days the school will be attending.
            </small>

            <div className="school_creation_form_field">
                <span>
                    <Inplace>
                        <InplaceDisplay>
                            View Data
                        </InplaceDisplay>
                        <InplaceContent>
                            <DataTable value={schoolTimes}>
                                <Column field="day" header="Day"></Column>
                                <Column field="time_start" header="Time Start"></Column>
                                <Column field="time_end" header="Time End"></Column>
                            </DataTable>
                        </InplaceContent>
                    </Inplace>
                </span>
            </div>
            
        </Card>
    );
};

export default AddSchoolForm;