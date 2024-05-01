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
    const [schoolDaysIn, setSchoolDaysIn] = useState<string[]>();
    const [schoolTime, setSchoolTime] = useState<Nullable<Date>>(null);

    //Variables to control toast messages
    const toast = useRef<Toast>(null);

    
    // Return JSX
    return (

        //Create the form to add a new school
        <Card title={"Add New School"}>

            <div>
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
                        id="set_school_name"
                        value={schoolEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolEmail(e.target.value.toUpperCase())}
                        required
                    />
                    <label htmlFor="set_school_name">School Email</label> 
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
                <span className="p-float-label">
                    <label htmlFor="calendar-timeonly" className="font-bold block mb-2">Time Slot</label>
                    <Calendar id="calendar-timeonly" value={schoolTime} onChange={(e) => setSchoolTime(e.value)}/>
                </span>
            </div>
            <small id="new_school_time_help" className='school_creation-form-help'>
                Enter the days the school will be attending.
            </small>
            
        </Card>
    );
};

export default AddSchoolForm;