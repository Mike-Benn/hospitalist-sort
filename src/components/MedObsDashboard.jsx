import { useState } from "react";
import Papa from "papaparse";
import PatientListFormSection from "./PatientListFormSection";
import GeneralButton from "../components/general/buttons/GeneralButton";
import DoctorRolesFormSection from "./DoctorRolesFormSection";
import { parseCsvFile, assignMedObsPatients } from "./utils/utils";


function MedObsDashboard() {

    const [physicianFormData, setPhysicianFormData] = useState({
        nursePractitionerOne: {
            name: "",
            patientList: {
                inpatient: [],
                observation: [],
            }
            

        },
        nursePractitionerTwo: {
            name: "",
            patientList: {
                inpatient: [],
                observation: [],
            },
        }
    })

    const [csvFile, setCsvFile] = useState(null);


    const handlePhysicianNameChange = (e) => {
        const { name, value } = e.target;
        setPhysicianFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev,
                name: value,
            }
        }))
    }

    const handleCsvFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.name.endsWith(".csv")) {
            alert("Please upload a .csv file.");
            return;
        }

        setCsvFile(file);
    }

    const assignPatients = async (e) => {
        e.preventDefault();
        // Sort patients by location, included locations: (med obs, )
        try {
            const patientList = await parseCsvFile(csvFile);
            assignMedObsPatients(physicianFormData.nursePractitionerOne.name, physicianFormData.nursePractitionerTwo.name, patientList.medObs)

        } catch (error) {
            console.error("Failed to parse CSV file", error);
        }
        
    }

    const patientListHandlers = {
        handleCsvFileChange,
    }

    const physicianHandlers = {
        handlePhysicianNameChange,
    }

    return (
        <form action="" onSubmit={assignPatients}>
            <DoctorRolesFormSection physicianFormData={physicianFormData} handlers={physicianHandlers} />
            <PatientListFormSection handlers={patientListHandlers} file={csvFile} />
            <GeneralButton buttonType="submit" buttonText="Assign Patients" />
        </form>
        
    )
}


export default MedObsDashboard