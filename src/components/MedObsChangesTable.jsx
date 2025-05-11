import { createMedObsPatientList } from "./utils/utils"

function MedObsChangesTable({ physicians }) {

    const patientList = createMedObsPatientList(physicians);
    
    return (
        <table style={{ borderCollapse: "collapse" }}>
            <thead>
                <tr>
                <th style={{ border: "1px solid black", padding: "4px" }}>Location</th>
                <th style={{ border: "1px solid black", padding: "4px "}}>Visit Type</th>
                <th style={{ border: "1px solid black", padding: "4px" }}>Current Attending</th>
                <th style={{ border: "1px solid black", padding: "4px" }}>New Attending</th>
                </tr>
            </thead>
            <tbody>
            {patientList.map((patient, index) => (
                <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "4px" }}>{patient.location}</td>
                    <td style={{ border: "1px solid black", padding: "4px" }}>{patient.visitType}</td>
                    <td style={{ border: "1px solid black", padding: "4px" }}>{patient.currentAttending}</td>
                    <td style={{ border: "1px solid black", padding: "4px", backgroundColor: patient.currentAttending.includes(patient.newAttending) ? 'transparent' : 'yellow' }}>{patient.newAttending}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )

}


export default MedObsChangesTable