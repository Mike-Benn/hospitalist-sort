import { calculateMedObsPhysicianStats } from "./utils/utils"


function MedObsTallyTable({ physicians }) {
    const npOneStats = calculateMedObsPhysicianStats(physicians.nursePractitionerOne);
    const npTwoStats = calculateMedObsPhysicianStats(physicians.nursePractitionerTwo);

    return (
        <table style={{ borderCollapse: "collapse" }}>
            <thead>
                <tr>
                <th style={{ border: "1px solid black", padding: "4px" }}></th>
                <th style={{ border: "1px solid black", padding: "4px" }}>Prior OV</th>
                <th style={{ border: "1px solid black", padding: "4px" }}>Prior IP</th>
                <th style={{ border: "1px solid black", padding: "4px" }}>New OV</th>
                <th style={{ border: "1px solid black", padding: "4px" }}>New IP</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td style={{ border: "1px solid black", padding: "4px" }}>{physicians.nursePractitionerOne.name}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npOneStats.priorObservations}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npOneStats.priorInpatients}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npOneStats.newObservations}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npOneStats.newInpatients}</td>
                </tr>
                <tr>
                <td style={{ border: "1px solid black", padding: "4px" }}>{physicians.nursePractitionerTwo.name}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npTwoStats.priorObservations}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npTwoStats.priorInpatients}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npTwoStats.newObservations}</td>
                <td style={{ border: "1px solid black", padding: "4px" }}>{npTwoStats.newInpatients}</td>
                </tr>
            </tbody>
        </table>

    )

}


export default MedObsTallyTable