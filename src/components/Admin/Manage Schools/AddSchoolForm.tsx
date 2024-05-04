// Import core functions
import { useState, useRef, useEffect } from 'react';
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
import { format } from 'date-fns';


//Import CSS
import './AddSchoolForm.css';
import { mask } from 'primereact/utils';
import { getValue } from 'firebase/remote-config';

//Create any interfaces needed
interface SchoolTime {
    day: string;
    startTime: string; // assuming start time as a simple hour for now
    endTime: string; // assuming end time as a simple hour
}

//React function to render the add school form
const AddSchoolForm: React.FC = () => {

    //Declaring Pre-Defined Arrays
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    //Variables to store the required school details
    const [schoolName, setSchoolName] = useState<string>("");
    const [schoolCode, setSchoolCode] = useState<any>(null);
    const [schoolPhone, setSchoolPhone] = useState<string>("");
    const [schoolEmail, setSchoolEmail] = useState<string>("");
    const [schoolDay, setSchoolDay] = useState<string>(daysOfWeek[0]);
    const [schoolTimeTo, setSchoolTimeTo] = useState<Date>(new Date(new Date().setHours(17,0,0,0)));
    const [schoolTimeFrom, setSchoolTimeFrom] = useState<Date>(new Date(new Date().setHours(9,0,0,0)));

    const [schoolTimes, setSchoolTimes] = useState<SchoolTime[]>([
            {
                day: "Monday",
                startTime: format(new Date(new Date().setHours(9, 0, 0, 0)), "kk:mm"),
                endTime: format(new Date(new Date().setHours(17, 0, 0, 0)), "kk:mm")
            }
        ]
    )  ;

    const addNewTimeSlot = (schoolDay: string, schoolTimeFrom: Date, schoolTimeTo: Date) => {
        const newSlot: SchoolTime = {
            day: schoolDay,
            startTime: format(schoolTimeFrom, "kk:mm"),
            endTime: format(schoolTimeTo, "kk:mm")
        };
        setSchoolTimes(prevSchoolTimes => [...prevSchoolTimes, newSlot]);
    };

    //Variables to control toast messages
    const toast = useRef<Toast>(null);

    function addSchoolError(type: any, title: string, message: string): void 
    {
        toast.current?.show({
            severity: type,
            summary: `${title}`,
            detail: `${message}`,
            closeIcon: 'pi pi-times',
            life: 7000,
        });
    }

    function updateClosingTimes(indexOfDay: number, newTime: Date): Date {

        let newTimeChange = new Date (newTime);
        if(indexOfDay >= 4 || indexOfDay == 0 ) {
            if (newTimeChange.getMinutes() > 30) {
                newTimeChange.setMinutes(30);
            }
        }
        else{
            if (newTimeChange.getMinutes() > 0) {
                newTimeChange.setMinutes(0);
            } 
        }

        return newTimeChange;
    }
    

    // Return JSX
    return (
        <>
            {/*  */}
            <Toast ref={toast} />
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
                        <Dropdown value={schoolDay} onChange={(e) => {setSchoolDay(e.value);  setSchoolTimeTo(updateClosingTimes(daysOfWeek.indexOf(e.value), schoolTimeTo))}} options={daysOfWeek}/>
                        <p className= "school_creation_time_components">From:</p>
                        <Calendar className= "school_creation_time_components" value={schoolTimeFrom}
                            timeOnly
                            incrementIcon = "pi pi-angle-up" 
                            decrementIcon = "pi pi-angle-down"
                            stepMinute={5}
                            onChange={(e) =>  {

                                    if (e.value) {
                                        let newTime = new Date(e.value)
                                        if (newTime.getHours() < 9) {
                                            newTime.setHours(9)
                                        }
                                        setSchoolTimeFrom(newTime);
                                    }
                                }
                            }
                        />
                        <p className= "school_creation_time_components">To:</p>
                        <Calendar className= "school_creation_time_components" value={schoolTimeTo}
                            timeOnly 
                            incrementIcon = "pi pi-angle-up"
                            decrementIcon = "pi pi-angle-down"
                            stepMinute={5}
                            onChange={(e) =>  {
                                    
                                    if (e.value)
                                    {
                                        let newTime = new Date(e.value)
                                        if (newTime.getHours() > 17) {
                                            newTime.setHours(17)
                                        }

                                        newTime = updateClosingTimes(daysOfWeek.indexOf(schoolDay), newTime);
                                        setSchoolTimeTo(newTime); 
                                    }
                                }
                            }  
                        />
                        <Button className="school_creation_time_components" label="Add Timing" 
                            onClick={() => { 

                                    if (schoolTimeFrom >= schoolTimeTo)
                                    {
                                        addSchoolError("error", "Time Imbalance", "Please set a time after your start time");
                                        return
                                    }

                                    addNewTimeSlot(schoolDay, schoolTimeFrom, schoolTimeTo);
                                    
                                }
                            }
                            severity="secondary"
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
                                <DataTable value={schoolTimes} tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="day" header="Day"></Column>
                                    <Column field="startTime" header="Start Time"></Column>
                                    <Column field="endTime" header="End Time"></Column>
                                </DataTable>
                            </InplaceContent>
                        </Inplace>
                    </span>
                </div>
                
            </Card>
        </>
    );
};

export default AddSchoolForm;