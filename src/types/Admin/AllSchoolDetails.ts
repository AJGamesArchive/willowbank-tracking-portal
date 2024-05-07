import { SchoolTimeSlot } from "../Schools/SchoolTimeSlot"

export type AllSchoolDetails = {
    schoolName: string,
    schoolCode: string,
    schoolEmail: string,
    schoolPhone: string,
    schoolTeachers: string[],
    schoolStudents: string[],
    schoolAdmins: string[],
    timetable: SchoolTimeSlot[]
}