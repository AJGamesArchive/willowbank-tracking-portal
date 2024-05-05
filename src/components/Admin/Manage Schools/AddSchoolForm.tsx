// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';

//Import CSS
import './AddSchoolForm.css';

//Import Functions
import { CheckSchoolBase } from '../../../functions/Admin/ManageSchools/CheckSchoolBase';

//Import Types
import { SchoolCreationStatus } from '../../../types/Schools/SchoolCreationStatus';


//Create any interfaces needed
interface SchoolTime {
    day: string;
    startTime: string; 
    endTime: string;
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
    const [slotSelection, setSlotSelection] = useState<SchoolTime[]>([]);
    const [schoolTimes, setSchoolTimes] = useState<SchoolTime[]>([]);

    const addNewTimeSlot = (schoolDay: string, schoolTimeFrom: Date, schoolTimeTo: Date) => {
        const newSlot: SchoolTime = {
            day: schoolDay,
            startTime: format(schoolTimeFrom, "kk:mm"),
            endTime: format(schoolTimeTo, "kk:mm"),
       };
        setSchoolTimes(prevSchoolTimes => [...prevSchoolTimes, newSlot]);
    };

    const deleteSelectedSlots = () => {
        setSchoolTimes(prevSchoolTimes => 
            prevSchoolTimes.filter(slot => !slotSelection.includes(slot))
        );
        setSlotSelection([]);
    };

    const addSchoolError = (type: any, title: string, message: string): void => {
        toast.current?.show({
            severity: type,
            summary: `${title}`,
            detail: `${message}`,
            closeIcon: 'pi pi-times',
            life: 7000,
        });
    }

    const slotChecking = (): Boolean =>   {

        let timeSlotExists: boolean = false;

        if (schoolTimeFrom >= schoolTimeTo){
            addSchoolError("error", "Time Imbalance", "Please set a time after your start time");
            return false;
        }

        schoolTimes.forEach(slot => {
            
            if (slot.day == schoolDay && slot.startTime == format(schoolTimeFrom,"kk:mm") && slot.endTime == format(schoolTimeTo,"kk:mm")) {
                timeSlotExists = true;
            }      
        })

        if(timeSlotExists) {
            addSchoolError("error", "Duplicate Timeslot", "The timeslot you've entered has already been added to the list.");
            return false
        }

        return true;
    }

    async function schoolCreationHandler() {

        if (schoolName === "") {
            addSchoolError("error", "Empty School Name", "The school name box is empty, please enter one before creation.");
            return;
        }
        if (schoolCode === null) {
            addSchoolError("error", "Empty School Code", "The school code box is empty, please enter one before creation.");
            return;
        }
        if (schoolEmail === "") {
            addSchoolError("error", "Empty School Email", "The school phone box is empty, please enter one before creation.");
            return;
        }
        if (schoolPhone === "") {
            addSchoolError("error", "Empty School Phone", "The school phone box is empty, please enter one before creation.");
            return;
        }
        if (schoolTimes.length === 0) {
            addSchoolError("error", "Empty Timeslot List", "The school timeslot list is empty, please enter one before creation.");
            return;
        }

        // Attempt to retrieve the name of the school that matches the given ID
        const results: SchoolCreationStatus = await CheckSchoolBase(schoolCode, schoolName, schoolEmail, schoolPhone);

        if(results.errored){

        }

        if(!results.success){
            addSchoolError(results.errorMessage.severity, results.errorMessage.header, results.errorMessage.message);
        }
        
    }


    //Variables to control toast messages
    const toast = useRef<Toast>(null);



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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value)}
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolEmail(e.target.value)}
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolPhone(e.target.value)}
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
                                        else if (newTime.getHours() > 16) {
                                            newTime.setHours(16)
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
                                        else if (newTime.getHours() < 10) {
                                            newTime.setHours(10)
                                        }

                                        newTime = updateClosingTimes(daysOfWeek.indexOf(schoolDay), newTime);
                                        setSchoolTimeTo(newTime); 
                                    }
                                }
                            }  
                        />
                        <Button className="school_creation_time_components" label="Add Timing" 
                            onClick={() => { 
                                    if (slotChecking() == true) {
                                        addNewTimeSlot(schoolDay, schoolTimeFrom, schoolTimeTo);
                                    }
                                }
                            }
                            severity="secondary"
                        />
                        <Button className="school_creation_time_components" label="Delete Selection" 
                            onClick={() => { 
                                    deleteSelectedSlots();
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
                        <DataTable value={schoolTimes} 
                            selection={slotSelection} 
                            selectionMode="multiple" 
                            tableStyle={{ minWidth: '50rem' }}
                            onSelectionChange={(e) => {setSlotSelection(e.value);}}>
                            <Column field="day" header="Day"></Column>
                            <Column field="startTime" header="Start Time"></Column>
                            <Column field="endTime" header="End Time"></Column>
                        </DataTable>
                    </span>
                </div>
                
                <div className="school_creation_form_field">
                    <span>
                        <Button className="school_creation_form_field" label="Create School" 
                            
                            severity="secondary"
                            onClick={() => {
                                schoolCreationHandler();
                            }}
                        />
                    </span>
                </div>
            </Card>
        </>
    );
};

export default AddSchoolForm;