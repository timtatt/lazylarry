// // To initialise endpoints which mock brightspace API
const axios = require('axios');
const moment = require('moment')
const apiUrl = 'http://localhost:9000'
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
                    arr.push({
                        'unitCode': input[i].unitCode,
                        'unitName': input[i].unitName,
                        'assignmentName': input[i][j].Name,
                        'dueDate': input[i][j].DueDate
                    })
                }
            }
            return arr
        }
        if (assignments) {
            return mergeData(assignments)
        }
    }


    // const addFakeDeadline = (amount = 1) => {
    //     subject name fake subject + makeId(6)
    //     assignments are just assignment1, assignemnt2, assignment3

    //     return

    //     [
    //         {
    //             unitCode: SIT+randomnum,
    //             unitName: string,
    //             assignmentName: Assignemnt 1,
    //             dueDate: DateNow + 1 ,
    //             submitted: boolean,
    //         },
    //         {
    //             unitCode: string,
    //             unitName: string,
    //             assignmentName: Assignment 2,
    //             dueDate: DateNow + 2 ,
    //             submitted: boolean,
    //         },
    //         {
    //             unitCode: string,
    //             unitName: string,
    //             assignmentName: Assignment 3,
    //             dueDate: DateNow + 3 ,
    //             submitted: boolean,
    //         },
    //     ]
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