import { GeneralInputField } from "../components/general/form-fields/InputFields"

function DoctorRolesFormSection({ physicianFormData, handlers }) {
    return (
        <fieldset>
            <legend>Hospitalist NP</legend>
            <GeneralInputField inputType="text" labelText="NP 1" onChange={handlers.handlePhysicianNameChange} value={physicianFormData.nursePractictionerOne} name="nursePractitionerOne" />
            <GeneralInputField inputType="text" labelText="NP 2" onChange={handlers.handlePhysicianNameChange} value={physicianFormData.nursePractictionerTwo} name="nursePractitionerTwo" />
        </fieldset>
    )
}

export default DoctorRolesFormSection