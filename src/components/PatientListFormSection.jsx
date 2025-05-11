import { FileAttachField } from "./general/form-fields/InputFields"

function PatientListFormSection ({ file, handlers}) {

    return (
        <fieldset>
            <legend>Upload file</legend>
            <FileAttachField fieldId="patient-list-file-attach" labelText="Attach .csv of patient list" onChange={handlers.handleCsvFileChange} accepts=".csv,text/csv" file={file} />
        </fieldset>
    )
}

export default PatientListFormSection