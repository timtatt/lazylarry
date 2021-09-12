// // To initialise endpoints which mock brightspace API
const axios = require('axios');
const moment = require('moment')
const apiUrl = 'http://localhost:9000'
const hardware = require('./hardware.js');
var config = require('./config.json')
const initMock = (app) => {
    app.get('/d2l/api/le/1.33/:unitCode/dropbox/folders/', (req, res) => {
        var unitCode = req.param.unitCode
        var mockNum = req.param.mockNum
        const rndInt = Math.floor(Math.random() * 4) + 1
        res.sendFile(__dirname + `/clouddeakin/mockUnit${rndInt}.json`)
    });
    app.get('/d2l/api/lp/1.26/enrollments/myenrollments/', (req, res) => {
        //'d2l/api/lp/1.26/enrollments/myenrollments/?orgUnitTypeId=3&sortBy=-StartDate'
        res.sendFile(__dirname + '/clouddeakin/mockEnrollments.json')
    });
    app.get('/disp', function (req, res) {
        res.sendFile(__dirname + "/clouddeakin/public/index.html");
    });
    app.get('/info', function (req, res) {
        getAssignmentDeadlines().then((data) => {
            res.send(data)
        })
    })
}

getEnrolments = async () => {
    let EnrollmentArr = [];
    let enrollmentData
    let enrollments = await axios.get(apiUrl + '/d2l/api/lp/1.26/enrollments/myenrollments/?orgUnitTypeId=3&sortBy=-StartDate');

    if (enrollments) {
        enrollmentData = enrollments.data.Items

        for (let i = 0; i < enrollmentData.length; i++) {
            if (moment().format('YYYY') == moment.utc(enrollmentData[i].Access.StartDate).format('YYYY')) {
                EnrollmentArr.push(
                    {
                        'id': enrollmentData[i].OrgUnit.Id,
                        'name': enrollmentData[i].OrgUnit.Name,
                        'code': enrollmentData[i].OrgUnit.Code,
                        'date': moment.utc(enrollmentData[i].Access.StartDate).format('YYYY')
                    })
            }
        }

    }
    return EnrollmentArr;
}

let getAssignmentDeadlines = async () => {
    let currentEnrollments = await getEnrolments()
    if (currentEnrollments) {

        let assignments = []

        for (i = 0; i < currentEnrollments.length; i++) {
            let results = await axios.get(apiUrl + `/d2l/api/le/1.33/${currentEnrollments[i].id}/dropbox/folders/`)
            if (results) { assignments.push(results.data) }
        }

        let mergeData = (input) => {
            let arr = []
            for (let i = 0; i < currentEnrollments.length; i++) {
                input[i].unitCode = currentEnrollments[i].code
                input[i].unitName = currentEnrollments[i].name
            }
            for (let i = 0; i < input.length; i++) {
                for (let j = 0; j < input[i].length; j++) {
                    if (moment().isBefore(moment.utc(input[i][j].DueDate))) {
                        // console.log(moment.utc(input[i][j].DueDate).milliseconds('x') >= moment().milliseconds('x'))
                        // console.log('due ' + moment.utc(input[i][j].DueDate).milliseconds('x'))
                        // console.log('today ' + moment().milliseconds('x'))

                        arr.push({
                            'unitCode': input[i].unitCode,
                            'unitName': input[i].unitName,
                            'assignmentName': input[i][j].Name,
                            'dueDateIso': input[i][j].DueDate,
                            'dueDate': moment.utc(input[i][j].DueDate).format('DD-MM-YYYY hh:mm:ss')
                        })
                    }
                }
            }
            return arr.sort((a, b) => moment(a.dueDateIso).milliseconds('x') - moment(b.dueDateIso).milliseconds('x'));
        }
        if (assignments) {
            let data = mergeData(assignments)
            let latest = data[0]
            colorsArr = Object.entries(config.colors)
            let hexVal;
            for (let i = colorsArr.length - 1; i >= 0; i--) {
                if (moment(`${latest.dueDateIso}`).isBetween(moment().format(), moment().add(colorsArr[i][1].threshold[0], colorsArr[i][1].threshold[1]))) {
                    hexVal = colorsArr[i][1].hexCode
                }
            }
            hardware.setColor(hexVal.substring(1))
            return data
        }
    }
}

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}




module.exports = {
    initMock,
    getAssignmentDeadlines
}

/*
 returns

 [
     {
         unitCode: string,
         unitName: string,
         assignmentName: string,
         dueDate: Date,
         submitted: boolean,
     }
 ]
 */