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
    
    const nursePractitionerOne = {
        name: nursePractitionerOneName,
        patientList: {
            prior: {
                inpatient: [],
                observation: [],
            },
            new: {
                inpatient: [],
                observation: [],
            }
            
        },
    }
    const nursePractitionerTwo = {
        name: nursePractitionerTwoName,
        patientList: {
            prior: {
                inpatient: [],
                observation: [],
            },
            new: {
                inpatient: [],
                observation: [],
            }
            
        },

    }


    
    // Sort patients into observation and inpatient lists

    for (let i = 0; i < medObsPatients.length; i++) {
        const patient = medObsPatients[i];
        if (patient.visitType === "Observation" || patient.visitType === "Outpatient in a Bed") {
            if (patient.currentAttending.includes(nursePractitionerOne.name)) {
                nursePractitionerOne.patientList.prior.observation.push(patient);
            } else if (patient.currentAttending.includes(nursePractitionerTwo.name)) {
                nursePractitionerTwo.patientList.prior.observation.push(patient);
            } else {
                newPatientsToAssign.observation.push(patient);
            }
        } else {
            if (patient.currentAttending.includes(nursePractitionerOne.name)) {
                nursePractitionerOne.patientList.prior.inpatient.push(patient);
            } else if (patient.currentAttending.includes(nursePractitionerTwo.name)) {
                nursePractitionerTwo.patientList.prior.inpatient.push(patient);
            } else {
                newPatientsToAssign.inpatient.push(patient);
            }
        }
    }

    
    // Assign inpatients

    for (let i = 0; i < newPatientsToAssign.inpatient.length; i++) {
        const patient = newPatientsToAssign.inpatient[i];
        const isNpOneCapped = calculateTotalPatients(nursePractitionerOne.patientList.prior) + calculateTotalPatients(nursePractitionerOne.patientList.new) >= cappedTotal;
        const isNpTwoCapped = calculateTotalPatients(nursePractitionerTwo.patientList.prior) + calculateTotalPatients(nursePractitionerTwo.patientList.new) >= cappedTotal;
        if (isNpOneCapped) {
            nursePractitionerTwo.patientList.new.inpatient.push(patient);
            continue;
        }

        if (isNpTwoCapped) {
            nursePractitionerOne.patientList.new.inpatient.push(patient);
            continue;
        }
        const inpatientDifference = (nursePractitionerOne.patientList.prior.inpatient.length + nursePractitionerOne.patientList.new.inpatient.length) - (nursePractitionerTwo.patientList.new.inpatient.length + nursePractitionerTwo.patientList.prior.inpatient.length);

        if (inpatientDifference <= 0) {
            nursePractitionerOne.patientList.new.inpatient.push(patient);
        } else {
            nursePractitionerTwo.patientList.new.inpatient.push(patient);
        }
    }

    // Assign observations
    for (let i = 0; i < newPatientsToAssign.observation.length; i++) {
        const patient = newPatientsToAssign.observation[i];
        const isNpOneCapped = calculateTotalPatients(nursePractitionerOne.patientList.prior) + calculateTotalPatients(nursePractitionerOne.patientList.new) >= cappedTotal;
        const isNpTwoCapped = calculateTotalPatients(nursePractitionerTwo.patientList.prior) + calculateTotalPatients(nursePractitionerTwo.patientList.new) >= cappedTotal;
        if (isNpOneCapped) {
            nursePractitionerTwo.patientList.new.observation.push(patient);
            continue;
        }

        if (isNpTwoCapped) {
            nursePractitionerOne.patientList.new.observation.push(patient);
            continue;
        }
        const patientDifference = (calculateTotalPatients(nursePractitionerOne.patientList.prior) + calculateTotalPatients(nursePractitionerOne.patientList.new)) - (calculateTotalPatients(nursePractitionerTwo.patientList.prior) + calculateTotalPatients(nursePractitionerTwo.patientList.new));

        if (patientDifference <= 0) {
            nursePractitionerOne.patientList.new.observation.push(patient);
        } else {
            nursePractitionerTwo.patientList.new.observation.push(patient);
        }
    }

    // Find deficient NP
    // Rebalance IPs
    // Reblance OVs
    let patientDifference = (calculateTotalPatients(nursePractitionerOne.patientList.prior) + calculateTotalPatients(nursePractitionerOne.patientList.new)) - (calculateTotalPatients(nursePractitionerTwo.patientList.prior) + calculateTotalPatients(nursePractitionerTwo.patientList.new));
    if (Math.abs(patientDifference) > 1) {
        let overloadedNp = patientDifference < 0 ? nursePractitionerTwo : nursePractitionerOne;
        let underloadedNp = patientDifference < 0 ? nursePractitionerOne : nursePractitionerTwo;
        while (Math.abs(patientDifference) > 1) {
            // Rebalance IPs
            const inpatientDifference = (overloadedNp.patientList.prior.inpatient.length + overloadedNp.patientList.new.inpatient.length) - (underloadedNp.patientList.new.inpatient.length + underloadedNp.patientList.prior.inpatient.length);
            if (inpatientDifference > 1) {
                if (overloadedNp.patientList.new.inpatient.length > 0) {
                    const patient = overloadedNp.patientList.new.inpatient.pop();
                    underloadedNp.patientList.new.inpatient.push(patient);
                } else {
                    const patient = overloadedNp.patientList.prior.inpatient.pop();
                    underloadedNp.patientList.new.inpatient.push(patient);
                }
                patientDifference = (calculateTotalPatients(nursePractitionerOne.patientList.prior) + calculateTotalPatients(nursePractitionerOne.patientList.new)) - (calculateTotalPatients(nursePractitionerTwo.patientList.prior) + calculateTotalPatients(nursePractitionerTwo.patientList.new));
                continue;
            }
            // Rebalance OVs
            if (overloadedNp.patientList.new.observation.length > 0) {
                const patient = overloadedNp.patientList.new.observation.pop();
                underloadedNp.patientList.new.observation.push(patient);
            } else {
                const patient = overloadedNp.patientList.prior.observation.pop();
                underloadedNp.patientList.new.observation.push(patient)
            }
            patientDifference = (calculateTotalPatients(nursePractitionerOne.patientList.prior) + calculateTotalPatients(nursePractitionerOne.patientList.new)) - (calculateTotalPatients(nursePractitionerTwo.patientList.prior) + calculateTotalPatients(nursePractitionerTwo.patientList.new));
        }        
    }

    return {
        nursePractitionerOne,
        nursePractitionerTwo,
    }

}

function calculateMedObsPhysicianStats(physician) {
    let priorInpatients = physician.patientList.prior.inpatient.length;
    let priorObservations = physician.patientList.prior.observation.length;
    let newInpatients = physician.patientList.new.inpatient.length;
    let newObservations = physician.patientList.new.observation.length;
    let totalPatients = priorInpatients + priorObservations + newInpatients + newObservations;

    return {
        priorInpatients,
        priorObservations,
        newInpatients,
        newObservations,
        totalPatients,
    }
}

function createMedObsPatientList(medObsPhysicians) {
    const combinedList = [];
    const npOneName = medObsPhysicians.nursePractitionerOne.name;
    const npTwoName = medObsPhysicians.nursePractitionerTwo.name;
    const npOnePriorList = medObsPhysicians.nursePractitionerOne.patientList.prior;
    const npOneNewList = medObsPhysicians.nursePractitionerOne.patientList.new;
    const npTwoPriorList = medObsPhysicians.nursePractitionerTwo.patientList.prior;
    const npTwoNewList = medObsPhysicians.nursePractitionerTwo.patientList.new;

    for (let i = 0; i < npOnePriorList.inpatient.length; i++) {
        const patient = { ...npOnePriorList.inpatient[i] };
        patient.newAttending = npOneName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npOnePriorList.observation.length; i++) {
        const patient = { ...npOnePriorList.observation[i] };
        patient.newAttending = npOneName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npOneNewList.inpatient.length; i++) {
        const patient = { ...npOneNewList.inpatient[i] };
        patient.newAttending = npOneName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npOneNewList.observation.length; i++) {
        const patient = { ...npOneNewList.observation[i] };
        patient.newAttending = npOneName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npTwoPriorList.inpatient.length; i++) {
        const patient = { ...npTwoPriorList.inpatient[i] };
        patient.newAttending = npTwoName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npTwoPriorList.observation.length; i++) {
        const patient = { ...npTwoPriorList.observation[i] };
        patient.newAttending = npTwoName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npTwoNewList.inpatient.length; i++) {
        const patient = { ...npTwoNewList.inpatient[i] };
        patient.newAttending = npTwoName;
        combinedList.push(patient);
    }
    for (let i = 0; i < npTwoNewList.observation.length; i++) {
        const patient = { ...npTwoNewList.observation[i] };
        patient.newAttending = npTwoName;
        combinedList.push(patient);
    }
    combinedList.sort((patientA, patientB) => patientA.location.localeCompare(patientB.location, undefined, { numeric: true }))
    return combinedList;
}

export {
    assignMedObsPatients,
    parseCsvFile,
    calculateMedObsPhysicianStats,
    createMedObsPatientList,

}


