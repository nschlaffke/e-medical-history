serverUrl = "http://localhost:8080/baseDstu3"

class Observation {
    constructor(data) {
        this.data = data
    }

    getDescription() {
        return this.data.code.text
    }

    getDate() {
        return this.data.issued
    }
}

class Patient {
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
        getPatientsUrl = serverUrl + "/Observation?patient=" + this.getId() + "&_sort=date&_format=json"
        xmlHttp.open( "GET", getPatientsUrl, false ); // false for synchronous request
        xmlHttp.send(null);
        var entries = JSON.parse(xmlHttp.responseText).entry
        return entries.map((e)=> {
            return new Observation(e.resource)
        })
    }

    getPatientDetails() {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        getPatientsUrl = serverUrl + "/Patient/" + this.getId() +"/$everything/?_format=json"
        xmlHttp.open( "GET", getPatientsUrl, false ); // false for synchronous request
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText)
    }
}

function getPatients() {
    console.log(serverUrl)
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    getPatientsUrl = serverUrl + "/Patient/?_format=json"
    xmlHttp.open( "GET", getPatientsUrl, false ); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText).entry.map((p) => {
        return new Patient(p.resource)
    })
}

patientList = getPatients()
for(patient of patientList) {
    console.log(patient.getName(), patient.getSurname())
    for (observation of patient.getObservations()) {
        console.log(observation.getDate(), observation.getDescription())
    }
    
}
