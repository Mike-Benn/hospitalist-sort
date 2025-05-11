import { useState } from "react";
import Papa from "papaparse";
import PatientListFormSection from "./PatientListFormSection";
import GeneralButton from "../components/general/buttons/GeneralButton";
import DoctorRolesFormSection from "./DoctorRolesFormSection";
import { parseCsvFile, assignMedObsPatients } from "./utils/utils";
import MedObsTallyTable from "./MedObsTallyTable";
import MedObsChangesTable from "./MedObsChangesTable";

function MedObsDashboard() {

    const [uiState, setUiState] = useState({
        viewMode: "editing",
    })
    const [physicianData, setPhysicianData] = useState({
        medObs: {},
    })
    const physicianDataTemplate = {
        medObs: {},
    }
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

    const physicianFormDataTemplate = {
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
    }

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

    const resetApplication = () => {
        setUiState((prev) => ({
            ...prev,
            viewMode: "editing"
        }))
        setCsvFile(null);
        setPhysicianFormData(physicianFormDataTemplate);
        setPhysicianData(physicianDataTemplate);
    }

    const assignPatients = async (e) => {
        e.preventDefault();
        setUiState((prev) => ({
            ...prev,
            viewMode: "loading"
        }))
        // Sort patients by location, included locations: (med obs, )
        try {
            const patientList = await parseCsvFile(csvFile);
            const medObsPhysicians = assignMedObsPatients(physicianFormData.nursePractitionerOne.name, physicianFormData.nursePractitionerTwo.name, patientList.medObs)
            setPhysicianData((prev) => ({
                ...prev,
                medObs: medObsPhysicians,
            }))
            setUiState((prev) => ({
                ...prev,
                viewMode: "viewing"
            }))


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
    if (uiState.viewMode === "loading") return <p>Loading...</p>
    let uiToRender;
    if (uiState.viewMode === "editing") {
        uiToRender = <form action="" onSubmit={assignPatients}>
                        <DoctorRolesFormSection physicianFormData={physicianFormData} handlers={physicianHandlers} />
                        <PatientListFormSection handlers={patientListHandlers} file={csvFile} />
                        <GeneralButton buttonType="submit" buttonText="Assign Patients" />
                    </form>
    } else if (uiState.viewMode === "viewing") {
        uiToRender = 
        <>
            <GeneralButton buttonType="button" buttonText="Reset" onClick={resetApplication}/>
            <hr />
            <MedObsTallyTable physicians={physicianData.medObs} />
            <hr />
            <MedObsChangesTable physicians={physicianData.medObs} />
        </>
    }

    return (
        <>
            {uiToRender}
        </>
        
        
    )
}


export default MedObsDashboard