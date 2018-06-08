var serverUrl = "http://localhost:8080/baseDstu3"

export class Observation {
    constructor(data) {
        this.description = data.code.text
        this.details = typeof data.valueCodeableConcept !== "undefined" ? data.valueCodeableConcept.text : "empty"
        this.date = data.issued
    }
}

export class MedicationStatement {
    constructor(data) {
        this.description = data.medicationCodeableConcept.text
        this.details = data.extension[0].valueCodeableConcept.text
        this.date = data.authoredOn
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