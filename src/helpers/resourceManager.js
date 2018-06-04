var serverUrl = "http://localhost:8080/baseDstu3"

class Observation {
    constructor(data) {
        this.data = data
        this.date = new Date(this.data.issued)
    }

    getDescription() {
        return this.data.code.text
    }

    getDate() {
        return this.date
    }

    getDetails() {
        var field;
        var def = "empty"
        try {
            field = this.data.valueCodeableConcept.text;
        }
        catch (err) {
            field = def;
        }
        return {
            text: field
        }
    }
}

class MedicationStatement {
    constructor(data) {
        this.data = data
        this.date = new Date(this.data.authoredOn)
    }

    getDescription() {
        return this.data.medicationCodeableConcept.text
    }

    getDate() {
        return this.date
    }

    getDetails() {
        return {
            text: this.data.extension[0].valueCodeableConcept.text
        }
    }
}

export class Patient {
    constructor(data) {
        this.data = data
    }

    getName() {
        return this.data.name[0].given[0];
    }

    getSurname() {
        return this.data.name[0].family
    }

    getId() {
        return this.data.id
    }

    getObservations() {

        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        var getPatientsUrl = serverUrl + "/Observation?patient=" + this.getId() + "&_sort=date&_format=json"
        xmlHttp.open("GET", getPatientsUrl, false); // false for synchronous request
        xmlHttp.send(null);
        var entries = JSON.parse(xmlHttp.responseText).entry
        return entries.map((e) => {
            return new Observation(e.resource)
        })
    }

    getMedicationStatements() {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        var getMedicationsUrl = serverUrl + "/MedicationRequest?patient=" + this.getId() + "&_format=json" // sorting may be neccesary
        xmlHttp.open("GET", getMedicationsUrl, false); // false for synchronous request
        xmlHttp.send(null);
        var entries = JSON.parse(xmlHttp.responseText).entry
        if (entries != null) {
            return entries.map((e) => {
                var data = e.resource
                return new MedicationStatement(data)
            })
        }
        else {
            return []
        }

    }

    getAllEvents() {
        var medications = this.getMedicationStatements()
        var observations = this.getObservations()
        var all = medications.concat(observations)
        all.sort((a, b) => {
            if (a.date > b.date) {
                return 1;
            }
            else {
                return -1;
            }
        })
        return all
    }
}

export function showPatients() {
    serverUrl = "http://localhost:8080/baseDstu3"
    console.log(serverUrl)

    var getPatientsUrl = serverUrl + "/Patient/?_format=json"
    var lol;

    lol = fetch(getPatientsUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            let patientList = json.entry.map((p) => {
                return new Patient(p.resource)
            })


            return json
        });

        console.log(lol)
}

function getPatients() {
    serverUrl = "http://localhost:8080/baseDstu3"
    console.log(serverUrl)

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    var getPatientsUrl = serverUrl + "/Patient/?_format=json"
    xmlHttp.open("GET", getPatientsUrl, false); // false for synchronous request
    xmlHttp.send();
    return JSON.parse(xmlHttp.responseText).entry.map((p) => {
        return new Patient(p.resource)
    })
}

function showPatients2() {

    let patientList = getPatients()
    console.log(patientList)
    for (let patient of patientList) {
        var events = patient.getAllEvents()
        console.log(patient.getName(), patient.getSurname())
        for (let event of events) {
            var dateString = String(event.getDate())
            var description = event.getDescription()
            var details = event.getDetails()
            console.log(dateString, ":", description)
            console.log(details)
        }
    }
}