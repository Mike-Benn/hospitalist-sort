import { GeneralInputField } from "../components/general/form-fields/InputFields"

function DoctorRolesFormSection({ practitionerFormData, handlers }) {
    return (
        <fieldset>
            <legend>Hospitalist NP</legend>
            <GeneralInputField inputType="text" labelText="NP 1" onChange={handlers.handlePractitionerChange} value={practitionerFormData.practictionerOne} name="practitionerOne" />
            <GeneralInputField inputType="text" labelText="NP 2" onChange={handlers.handlePractitionerChange} value={practitionerFormData.practictionerTwo} name="practitionerTwo" />
        </fieldset>
    )
}

export default DoctorRolesFormSection