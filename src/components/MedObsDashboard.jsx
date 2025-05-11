import { useState } from "react";
import Papa from "papaparse";
import PatientListFormSection from "./PatientListFormSection";
import GeneralButton from "../components/general/buttons/GeneralButton";
import DoctorRolesFormSection from "./DoctorRolesFormSection";


function MedObsDashboard() {

    const [practictionerFormData, setPractitionerFormData] = useState({
        nursePractitionerOne: "",
        nursePractitionerTwo: "",
    })

    const [csvFile, setCsvFile] = useState(null);


    const handlePractitionerChange = (e) => {
        const { name, value } = e.target;
        setPractitionerFormData((prev) => ({
            ...prev,
            [name]: value,
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

    const assignPatients = () => {
        const filteredData = [];
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            step: (row) => {
              const data = row.data;
          
              if (data.medicalService === "Hospitalist") {
                filteredData.push(data);
              }
            },
            complete: () => {
              console.log('Filtered Results:', filteredData);
            },
            error: (error) => {
              console.error('Parsing error:', error);
              alert('Failed to parse CSV.');
            },
          })
    }

    const practitionerHandlers = {
        handlePractitionerChange,
    }

    return (
        <form action="" onSubmit={assignPatients}>
            <DoctorRolesFormSection practitionerFormData={practictionerFormData} handlers={practitionerHandlers} />
            <PatientListFormSection handlers={handleCsvFileChange} file={csvFile} />
            <GeneralButton buttonType="submit" buttonText="Assign Patients" />
        </form>
        
    )
}


export default MedObsDashboard