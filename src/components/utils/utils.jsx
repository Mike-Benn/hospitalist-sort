import Papa from "papaparse"

// Returns true if x and y are within 1 of each other
function isBalanced(x, y) {
    const difference = x - y;
    return Math.abs(difference) <= 1;
}

function calculateTotalPatients(patientList) {
    return patientList.observation.length + patientList.inpatient.length;
}

function parseCsvFile(file) {
    return new Promise((resolve, reject) => {
        const patientList = {};
        const medObs = [];

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            step: (row) => {
              const data = row.data;
          
              if (data.medicalService === "Hospitalist") {
                if (data.location.includes("BAG")) {
                    medObs.push(data);
                }
              }
            },
            complete: () => {
                patientList.medObs = medObs;
                resolve(patientList)
            },
            error: (error) => {
                reject(error)
            },
        })
    })
}

function assignMedObsPatients(nursePractitionerOneName, nursePractitionerTwoName, medObsPatients) {
    // flow
    // calculate total inpatient and observation totals for both doctors
    // balance inpatients 
    // balance observation
    const totalPatients = medObsPatients.length;
    const cappedTotal = Math.ceil(totalPatients / 2);
    const newPatientsToAssign = {
        inpatient: [],
        observation: [],
    }

    const nurseOneTempList = [];
    const nurseTwoTempList = [];
    
    const nursePractitionerOne = {
        name: nursePractitionerOneName,
            patientList: {
                inpatient: [],
                observation: [],
            }
    }
    const nursePractitionerTwo = {
        name: nursePractitionerTwoName,
            patientList: {
                inpatient: [],
                observation: [],
            }
    }


    
    // Sort patients into observation and inpatient lists

    for (let i = 0; i < medObsPatients.length; i++) {
        const patient = medObsPatients[i];
        if (patient.visitType === "Observation" || patient.visitType === "Outpatient in a Bed") {
            if (patient.currentAttending.includes(nursePractitionerOne.name)) {
                nursePractitionerOne.patientList.observation.push(patient);
            } else if (patient.currentAttending.includes(nursePractitionerTwo.name)) {
                nursePractitionerTwo.patientList.observation.push(patient);
            } else {
                newPatientsToAssign.observation.push(patient);
            }
        } else {
            if (patient.currentAttending.includes(nursePractitionerOne.name)) {
                nursePractitionerOne.patientList.inpatient.push(patient);
            } else if (patient.currentAttending.includes(nursePractitionerTwo.name)) {
                nursePractitionerTwo.patientList.inpatient.push(patient);
            } else {
                newPatientsToAssign.inpatient.push(patient);
            }
        }
    }

    
    // Assign inpatients

    for (let i = 0; i < newPatientsToAssign.inpatient.length; i++) {
        const patient = newPatientsToAssign.inpatient[i];
        const isNpOneCapped = calculateTotalPatients(nursePractitionerOne.patientList) >= cappedTotal;
        const isNpTwoCapped = calculateTotalPatients(nursePractitionerTwo.patientList) >= cappedTotal;
        if (isNpOneCapped) {
            nursePractitionerTwo.patientList.inpatient.push(patient);
            continue;
        }

        if (isNpTwoCapped) {
            nursePractitionerOne.patientList.inpatient.push(patient);
            continue;
        }
        const inpatientDifference = nursePractitionerOne.patientList.inpatient.length - nursePractitionerTwo.patientList.inpatient.length;

        if (inpatientDifference <= 0) {
            nursePractitionerOne.patientList.inpatient.push(patient);
        } else {
            nursePractitionerTwo.patientList.inpatient.push(patient);
        }
    }

    // Assign observations
    for (let i = 0; i < newPatientsToAssign.observation.length; i++) {
        const patient = newPatientsToAssign.observation[i];
        const isNpOneCapped = calculateTotalPatients(nursePractitionerOne.patientList) >= cappedTotal;
        const isNpTwoCapped = calculateTotalPatients(nursePractitionerTwo.patientList) >= cappedTotal;
        if (isNpOneCapped) {
            nursePractitionerTwo.patientList.observation.push(patient);
            continue;
        }

        if (isNpTwoCapped) {
            nursePractitionerOne.patientList.observation.push(patient);
            continue;
        }
        const patientDifference = calculateTotalPatients(nursePractitionerOne.patientList) - calculateTotalPatients(nursePractitionerTwo.patientList);

        if (patientDifference <= 0) {
            nursePractitionerOne.patientList.observation.push(patient);
        } else {
            nursePractitionerTwo.patientList.observation.push(patient);
        }
    }

    // Find deficient NP
    // Rebalance IPs
    // Reblance OVs
    let patientDifference = calculateTotalPatients(nursePractitionerOne.patientList) - calculateTotalPatients(nursePractitionerTwo.patientList);
    if (Math.abs(patientDifference) > 1) {
        let overloadedNp = patientDifference < 0 ? nursePractitionerTwo : nursePractitionerOne;
        let underloadedNp = patientDifference < 0 ? nursePractitionerOne : nursePractitionerTwo;
        while (Math.abs(patientDifference) > 1) {
            // Rebalance IPs
            if (overloadedNp.patientList.inpatient.length - underloadedNp.patientList.inpatient.length > 1) {
                const patient = overloadedNp.patientList.inpatient.pop();
                underloadedNp.patientList.inpatient.push(patient);
                patientDifference = calculateTotalPatients(overloadedNp.patientList) - calculateTotalPatients(underloadedNp.patientList);
                continue;
            }
            // Rebalance OVs
            const patient = overloadedNp.patientList.observation.pop();
            underloadedNp.patientList.observation.push(patient);
            patientDifference = calculateTotalPatients(overloadedNp.patientList) - calculateTotalPatients(underloadedNp.patientList);
        }        
    }
    
    console.log(nursePractitionerOne, nursePractitionerTwo)


}

export {
    assignMedObsPatients,
    parseCsvFile,

}


